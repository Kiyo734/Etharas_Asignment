import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Modal from '../ui/Modal'
import { useToast } from '../ui/Toast'
import api from '../../api/axios'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  assigneeId: z.string().optional(),
})

export default function TaskModal({ isOpen, onClose, task, defaultStatus, defaultProjectId }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEdit = !!task

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '', description: '',
      status: defaultStatus || 'TODO',
      priority: 'MEDIUM',
      dueDate: '', projectId: defaultProjectId || '', assigneeId: '',
    },
  })

  const watchedProjectId = watch('projectId')

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
    enabled: isOpen,
  })

  const { data: membersData } = useQuery({
    queryKey: ['project-members', watchedProjectId],
    queryFn: () => api.get(`/projects/${watchedProjectId}/members`).then(r => r.data),
    enabled: !!watchedProjectId,
  })

  useEffect(() => {
    if (isOpen) {
      if (task) {
        reset({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'TODO',
          priority: task.priority || 'MEDIUM',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          projectId: task.projectId || '',
          assigneeId: task.assigneeId || '',
        })
      } else {
        reset({
          title: '', description: '',
          status: defaultStatus || 'TODO',
          priority: 'MEDIUM',
          dueDate: '', projectId: defaultProjectId || '', assigneeId: '',
        })
      }
    }
  }, [isOpen, task, defaultStatus, defaultProjectId, reset])

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, dueDate: data.dueDate || null, assigneeId: data.assigneeId || null }
      return isEdit ? api.patch(`/tasks/${task.id}`, payload) : api.post('/tasks', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast(isEdit ? 'Task updated' : 'Task created', 'success')
      onClose()
    },
    onError: (err) => toast(err.response?.data?.error || 'Something went wrong', 'error'),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit(d => mutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="field">
          <label className="field-label">Title</label>
          <input className={`input ${errors.title ? 'error' : ''}`} placeholder="Task title..." {...register('title')} />
          {errors.title && <span className="field-error">{errors.title.message}</span>}
        </div>

        <div className="field">
          <label className="field-label">Description <span style={{ color: 'var(--text-3)' }}>(optional)</span></label>
          <textarea className="input" placeholder="Add details..." rows={3} {...register('description')} />
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label">Status</label>
            <select className="input" {...register('status')}>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div className="field">
            <label className="field-label">Priority</label>
            <select className="input" {...register('priority')}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="field-label">Project</label>
            <select className={`input ${errors.projectId ? 'error' : ''}`} {...register('projectId')}>
              <option value="">Select project...</option>
              {projectsData?.projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {errors.projectId && <span className="field-error">{errors.projectId.message}</span>}
          </div>
          <div className="field">
            <label className="field-label">Assignee</label>
            <select className="input" {...register('assigneeId')}>
              <option value="">Unassigned</option>
              {membersData?.members?.map(m => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Due date <span style={{ color: 'var(--text-3)' }}>(optional)</span></label>
          <input type="date" className="input" {...register('dueDate')} />
        </div>

        <div className="modal-footer" style={{ padding: 0, marginTop: '4px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending && <span className="spinner" />}
            {isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

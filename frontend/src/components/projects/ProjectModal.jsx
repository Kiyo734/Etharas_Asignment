import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from '../ui/Modal'
import { useToast } from '../ui/Toast'
import api from '../../api/axios'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED']),
})

export default function ProjectModal({ isOpen, onClose, project }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEdit = !!project

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', status: 'ACTIVE' },
  })

  useEffect(() => {
    if (isOpen) {
      reset(project
        ? { name: project.name, description: project.description || '', status: project.status }
        : { name: '', description: '', status: 'ACTIVE' }
      )
    }
  }, [isOpen, project, reset])

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? api.patch(`/projects/${project.id}`, data) : api.post('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast(isEdit ? 'Project updated' : 'Project created', 'success')
      onClose()
    },
    onError: (err) => toast(err.response?.data?.error || 'Something went wrong', 'error'),
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Project' : 'New Project'} size="sm">
      <form onSubmit={handleSubmit(d => mutation.mutate(d))} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="field">
          <label className="field-label">Project name</label>
          <input className={`input ${errors.name ? 'error' : ''}`} placeholder="e.g. Website Redesign" {...register('name')} />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </div>

        <div className="field">
          <label className="field-label">Description <span style={{ color: 'var(--text-3)' }}>(optional)</span></label>
          <textarea className="input" placeholder="What is this project about?" rows={3} {...register('description')} />
        </div>

        <div className="field">
          <label className="field-label">Status</label>
          <select className="input" {...register('status')}>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="modal-footer" style={{ padding: 0, marginTop: '4px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending && <span className="spinner" />}
            {isEdit ? 'Save changes' : 'Create project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

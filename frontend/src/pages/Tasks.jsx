import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, CheckSquare, Search, Trash2, Pencil } from 'lucide-react'
import Header from '../components/layout/Header'
import TaskModal from '../components/tasks/TaskModal'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { useToast } from '../components/ui/Toast'
import api from '../api/axios'

function formatDate(d) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(d) {
  return d && new Date(d) < new Date()
}

export default function Tasks() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [taskModal, setTaskModal] = useState({ open: false, task: null })
  const [filters, setFilters] = useState({ projectId: '', status: '', priority: '', search: '' })

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => {
      const params = {}
      if (filters.projectId) params.projectId = filters.projectId
      if (filters.status) params.status = filters.status
      if (filters.priority) params.priority = filters.priority
      if (filters.search) params.search = filters.search
      return api.get('/tasks', { params }).then(r => r.data)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast('Task deleted', 'success')
    },
    onError: (err) => toast(err.response?.data?.error || 'Failed to delete task', 'error'),
  })

  const tasks = data?.tasks || []
  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))

  return (
    <>
      <Header
        title="Tasks"
        subtitle="All tasks across your projects"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setTaskModal({ open: true, task: null })}>
            <Plus size={14} /> New Task
          </button>
        }
      />
      <div className="page">
        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="input search-input"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              style={{ width: '180px', padding: '6px 10px 6px 30px' }}
            />
          </div>
          <select className="input" value={filters.projectId} onChange={e => setFilter('projectId', e.target.value)} style={{ width: '160px', padding: '6px 10px' }}>
            <option value="">All Projects</option>
            {projectsData?.projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="input" value={filters.status} onChange={e => setFilter('status', e.target.value)} style={{ width: '140px', padding: '6px 10px' }}>
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
          <select className="input" value={filters.priority} onChange={e => setFilter('priority', e.target.value)} style={{ width: '130px', padding: '6px 10px' }}>
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <LoadingSpinner />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No tasks found"
            description="Create a task or adjust your filters"
            action={
              <button className="btn btn-primary btn-sm" onClick={() => setTaskModal({ open: true, task: null })}>
                <Plus size={14} /> New Task
              </button>
            }
          />
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'
                  return (
                    <tr key={task.id}>
                      <td>
                        <div style={{ maxWidth: 320 }}>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {task.title}
                          </div>
                          {task.description && (
                            <div style={{ fontSize: '11.5px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                              {task.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--text-2)', background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: '5px' }}>
                          {task.project?.name}
                        </span>
                      </td>
                      <td><StatusBadge status={task.status} /></td>
                      <td><PriorityBadge priority={task.priority} /></td>
                      <td>
                        {task.assignee ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <Avatar name={task.assignee.name} size="xs" />
                            <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{task.assignee.name}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>—</span>
                        )}
                      </td>
                      <td>
                        {task.dueDate ? (
                          <span style={{ fontSize: '12px', color: overdue ? '#f87171' : 'var(--text-2)', fontVariantNumeric: 'tabular-nums' }}>
                            {overdue && '⚠ '}{formatDate(task.dueDate)}
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>—</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0, transition: 'opacity 0.1s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setTaskModal({ open: true, task })} title="Edit">
                            <Pencil size={13} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm btn-icon"
                            onClick={() => { if (confirm('Delete this task?')) deleteMutation.mutate(task.id) }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={taskModal.open}
        onClose={() => setTaskModal({ open: false, task: null })}
        task={taskModal.task}
      />
    </>
  )
}

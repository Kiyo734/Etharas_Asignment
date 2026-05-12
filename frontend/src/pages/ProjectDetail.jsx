import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Settings, Users, Trash2, UserPlus, ChevronDown } from 'lucide-react'
import Header from '../components/layout/Header'
import KanbanColumn from '../components/tasks/KanbanColumn'
import TaskModal from '../components/tasks/TaskModal'
import ProjectModal from '../components/projects/ProjectModal'
import Avatar from '../components/ui/Avatar'
import { RoleBadge, StatusBadge } from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [taskModal, setTaskModal] = useState({ open: false, task: null, status: 'TODO' })
  const [editModal, setEditModal] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)
  const [addMemberModal, setAddMemberModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get(`/projects/${id}`).then(r => r.data),
  })

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(r => r.data),
    enabled: addMemberModal,
  })

  const addMemberMutation = useMutation({
    mutationFn: (userId) => api.post(`/projects/${id}/members`, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      toast('Member added', 'success')
      setAddMemberModal(false)
      setSelectedUserId('')
    },
    onError: (err) => toast(err.response?.data?.error || 'Failed to add member', 'error'),
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId) => api.delete(`/projects/${id}/members/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      toast('Member removed', 'success')
    },
    onError: (err) => toast(err.response?.data?.error || 'Failed to remove member', 'error'),
  })

  const deleteProjectMutation = useMutation({
    mutationFn: () => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast('Project deleted', 'success')
      navigate('/projects')
    },
    onError: (err) => toast(err.response?.data?.error || 'Failed to delete project', 'error'),
  })

  if (isLoading) return <LoadingSpinner fullPage />

  const project = data?.project
  if (!project) return null

  const tasks = project.tasks || []
  const members = project.members || []
  const isOwnerOrAdmin = user?.role === 'ADMIN' || project.ownerId === user?.id
  const tasksByStatus = STATUSES.reduce((acc, s) => { acc[s] = tasks.filter(t => t.status === s); return acc }, {})
  const existingIds = new Set(members.map(m => m.user.id))
  const availableUsers = (usersData?.users || []).filter(u => !existingIds.has(u.id))

  return (
    <>
      <Header
        title={project.name}
        subtitle={project.description || undefined}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StatusBadge status={project.status} />
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setMembersOpen(!membersOpen)}
              style={{ gap: '5px' }}
            >
              <Users size={13} />
              {members.length}
              <ChevronDown size={12} style={{ transform: membersOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setTaskModal({ open: true, task: null, status: 'TODO' })}>
              <Plus size={13} /> Task
            </button>
            {isOwnerOrAdmin && (
              <>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setEditModal(true)} title="Edit project">
                  <Settings size={14} />
                </button>
                <button
                  className="btn btn-danger btn-sm btn-icon"
                  onClick={() => { if (confirm('Delete this project? This cannot be undone.')) deleteProjectMutation.mutate() }}
                  title="Delete project"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Back */}
        <div style={{ padding: '12px 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')} style={{ gap: '5px' }}>
            <ArrowLeft size={13} /> Projects
          </button>
        </div>

        {/* Members panel */}
        {membersOpen && (
          <div style={{ margin: '12px 24px 0', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', animation: 'slideUp 0.15s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Team Members</span>
              {isOwnerOrAdmin && (
                <button className="btn btn-secondary btn-sm" onClick={() => setAddMemberModal(true)}>
                  <UserPlus size={13} /> Add member
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {members.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 10px' }}>
                  <Avatar name={m.user.name} size="sm" />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text)' }}>{m.user.name}</div>
                    <RoleBadge role={m.role} />
                  </div>
                  {isOwnerOrAdmin && m.user.id !== project.ownerId && (
                    <button
                      onClick={() => removeMemberMutation.mutate(m.user.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: '2px', marginLeft: '2px', display: 'flex' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kanban */}
        <div style={{ flex: 1, padding: '16px 24px 24px', overflow: 'auto' }}>
          <div className="kanban-board">
            {STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onAddTask={s => setTaskModal({ open: true, task: null, status: s })}
                onTaskClick={task => setTaskModal({ open: true, task, status: task.status })}
              />
            ))}
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={taskModal.open}
        onClose={() => setTaskModal({ open: false, task: null, status: 'TODO' })}
        task={taskModal.task}
        defaultStatus={taskModal.status}
        defaultProjectId={id}
      />

      <ProjectModal isOpen={editModal} onClose={() => setEditModal(false)} project={project} />

      <Modal isOpen={addMemberModal} onClose={() => setAddMemberModal(false)} title="Add Member" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="field">
            <label className="field-label">Select user</label>
            <select className="input" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
              <option value="">Choose a user...</option>
              {availableUsers.map(u => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
            </select>
          </div>
          <div className="modal-footer" style={{ padding: 0 }}>
            <button className="btn btn-secondary" onClick={() => setAddMemberModal(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => selectedUserId && addMemberMutation.mutate(selectedUserId)}
              disabled={!selectedUserId || addMemberMutation.isPending}
            >
              {addMemberMutation.isPending && <span className="spinner" />}
              Add member
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

import { useQuery } from '@tanstack/react-query'
import { FolderOpen, CheckSquare, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

function formatDate(d) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(d) {
  return d && new Date(d) < new Date()
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/stats').then(r => r.data),
  })

  if (isLoading) return <LoadingSpinner fullPage />

  const stats = data?.stats || {}
  const recentTasks = data?.recentTasks || []
  const statusData = stats.tasksByStatus || {}
  const total = Object.values(statusData).reduce((a, b) => a + b, 0)

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects || 0, icon: FolderOpen, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'My Tasks', value: stats.myTasks || 0, icon: CheckSquare, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Overdue', value: stats.overdueTasks || 0, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Done Today', value: stats.completedToday || 0, icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  ]

  const bars = [
    { label: 'To Do', key: 'TODO', color: '#475569' },
    { label: 'In Progress', key: 'IN_PROGRESS', color: '#3b82f6' },
    { label: 'In Review', key: 'IN_REVIEW', color: '#f59e0b' },
    { label: 'Done', key: 'DONE', color: '#22c55e' },
  ]

  return (
    <>
      <Header title="Dashboard" subtitle={`Good to see you, ${user?.name?.split(' ')[0]}`} />
      <div className="page">

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          {statCards.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '16px' }}>
          {/* Distribution */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="section-title">Task Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bars.map((b) => {
                const count = statusData[b.key] || 0
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={b.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{b.label}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-3)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: b.color }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {total > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '6px' }}>Completion</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                  {Math.round(((statusData.DONE || 0) / total) * 100)}%
                </div>
              </div>
            )}
          </div>

          {/* Recent tasks */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Recent Tasks</div>
              <button
                onClick={() => navigate('/tasks')}
                className="btn btn-ghost btn-sm"
                style={{ gap: '4px', fontSize: '11px' }}
              >
                View all <ArrowUpRight size={12} />
              </button>
            </div>
            <div>
              {recentTasks.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>
                  No tasks yet
                </div>
              ) : (
                recentTasks.map((task, i) => {
                  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'
                  return (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 18px',
                        borderBottom: i < recentTasks.length - 1 ? '1px solid rgba(30,45,66,0.5)' : 'none',
                        transition: 'background 0.1s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginTop: '2px' }}>
                          {task.project?.name}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                        {task.dueDate && (
                          <span style={{ fontSize: '11px', color: overdue ? '#f87171' : 'var(--text-3)', fontVariantNumeric: 'tabular-nums' }}>
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

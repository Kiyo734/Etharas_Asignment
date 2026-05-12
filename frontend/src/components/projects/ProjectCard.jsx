import { useNavigate } from 'react-router-dom'
import { Users, CheckSquare } from 'lucide-react'
import { StatusBadge } from '../ui/Badge'

export default function ProjectCard({ project }) {
  const navigate = useNavigate()
  const tasks = project.tasks || []
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'DONE').length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="card-hover" style={{ padding: '18px 20px' }} onClick={() => navigate(`/projects/${project.id}`)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }}>
            {project.name}
          </div>
          {project.description && (
            <div style={{ fontSize: '12px', color: 'var(--text-3)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>
              {project.description}
            </div>
          )}
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Progress</span>
          <span style={{ fontSize: '11px', color: 'var(--text-2)', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--text-3)' }}>
          <CheckSquare size={12} />
          {done}/{total} tasks
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: 'var(--text-3)' }}>
          <Users size={12} />
          {project._count?.members || 0} members
        </span>
      </div>
    </div>
  )
}

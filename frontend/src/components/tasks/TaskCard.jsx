import { Calendar, AlertCircle } from 'lucide-react'
import { PriorityBadge, getPriorityClass } from '../ui/Badge'
import Avatar from '../ui/Avatar'

function formatDate(d) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(d) {
  return d && new Date(d) < new Date()
}

export default function TaskCard({ task, onClick }) {
  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'

  return (
    <div
      className={`task-card ${getPriorityClass(task.priority)}`}
      onClick={() => onClick?.(task)}
    >
      <div className="task-card-title">{task.title}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="task-card-footer">
        {task.dueDate ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: overdue ? '#f87171' : 'var(--text-3)' }}>
            {overdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
            {formatDate(task.dueDate)}
          </div>
        ) : <span />}
        {task.assignee && <Avatar name={task.assignee.name} size="sm" />}
      </div>
    </div>
  )
}

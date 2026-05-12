import { Plus } from 'lucide-react'
import TaskCard from './TaskCard'

const colConfig = {
  TODO:        { label: 'To Do',       color: '#64748b', dot: '#475569' },
  IN_PROGRESS: { label: 'In Progress', color: '#3b82f6', dot: '#3b82f6' },
  IN_REVIEW:   { label: 'In Review',   color: '#f59e0b', dot: '#f59e0b' },
  DONE:        { label: 'Done',        color: '#22c55e', dot: '#22c55e' },
}

export default function KanbanColumn({ status, tasks = [], onAddTask, onTaskClick }) {
  const cfg = colConfig[status]

  return (
    <div className="kanban-col">
      <div className="kanban-header">
        <div className="kanban-col-title" style={{ color: cfg.color }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
          {cfg.label}
          <span className="kanban-count">{tasks.length}</span>
        </div>
        <button
          className="btn btn-icon btn-ghost"
          style={{ padding: '3px' }}
          onClick={() => onAddTask?.(status)}
          title={`Add to ${cfg.label}`}
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="kanban-tasks">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
        {tasks.length === 0 && (
          <div style={{
            border: '1px dashed var(--border)',
            borderRadius: '8px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'var(--text-3)',
          }}>
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}

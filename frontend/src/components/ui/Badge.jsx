const statusMap = {
  TODO:        { label: 'Todo',        cls: 'badge badge-todo' },
  IN_PROGRESS: { label: 'In Progress', cls: 'badge badge-inprogress' },
  IN_REVIEW:   { label: 'In Review',   cls: 'badge badge-inreview' },
  DONE:        { label: 'Done',        cls: 'badge badge-done' },
  ACTIVE:      { label: 'Active',      cls: 'badge badge-active' },
  COMPLETED:   { label: 'Completed',   cls: 'badge badge-completed' },
  ARCHIVED:    { label: 'Archived',    cls: 'badge badge-archived' },
}

const priorityMap = {
  LOW:    { label: 'Low',    cls: 'badge badge-low' },
  MEDIUM: { label: 'Medium', cls: 'badge badge-medium' },
  HIGH:   { label: 'High',   cls: 'badge badge-high' },
  URGENT: { label: 'Urgent', cls: 'badge badge-urgent' },
}

const roleMap = {
  ADMIN:  { label: 'Admin',  cls: 'badge badge-admin' },
  MEMBER: { label: 'Member', cls: 'badge badge-member' },
}

export function StatusBadge({ status }) {
  const cfg = statusMap[status] || statusMap.TODO
  return (
    <span className={cfg.cls}>
      <span className="badge-dot" />
      {cfg.label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const cfg = priorityMap[priority] || priorityMap.MEDIUM
  return <span className={cfg.cls}>{cfg.label}</span>
}

export function RoleBadge({ role }) {
  const cfg = roleMap[role] || roleMap.MEMBER
  return <span className={cfg.cls}>{cfg.label}</span>
}

export function getPriorityClass(priority) {
  const map = { LOW: 'priority-low', MEDIUM: 'priority-medium', HIGH: 'priority-high', URGENT: 'priority-urgent' }
  return map[priority] || 'priority-medium'
}

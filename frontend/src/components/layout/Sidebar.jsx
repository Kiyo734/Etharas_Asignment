import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, CheckSquare, Users, LogOut, Layers } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const colors = ['#7c3aed','#2563eb','#db2777','#d97706','#059669','#dc2626']
function getColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return colors[Math.abs(h) % colors.length]
}
function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Sidebar() {
  const { user, logout } = useAuth()

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderOpen, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    ...(user?.role === 'ADMIN' ? [{ to: '/team', icon: Users, label: 'Team' }] : []),
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <Layers size={18} color="#fff" />
        </div>
        <span className="logo-text">TaskFlow</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Workspace</span>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <link.icon size={15} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div
            className="avatar"
            style={{ width: 32, height: 32, background: getColor(user?.name || ''), color: '#fff', fontSize: '11px' }}
          >
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
              {user?.role === 'ADMIN' ? 'Administrator' : 'Member'}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="nav-item"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', marginTop: '2px' }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, CheckSquare, Users, LogOut, Zap, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const colors = ['#00d4ff','#b44dff','#ff4488','#ffb800','#00ff88','#ff6600']
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

  const color = getColor(user?.name || '')

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <Zap size={16} color="#000" />
        </div>
        <span className="logo-text">TaskFlow</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Navigation</span>
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
            style={{ width: 30, height: 30, background: color, color: '#000', fontSize: '10px', fontWeight: 800, boxShadow: `0 0 10px ${color}40` }}
          >
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
              {user?.role === 'ADMIN' ? 'Administrator' : 'Member'}
            </div>
          </div>
          <ChevronRight size={12} color="var(--text-3)" />
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

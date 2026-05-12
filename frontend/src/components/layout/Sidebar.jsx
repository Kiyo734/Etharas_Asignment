import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, CheckSquare, Users, LogOut, Terminal, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const avatarColors = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#06b6d4']
function getColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return avatarColors[Math.abs(h) % avatarColors.length]
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderOpen, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    ...(user?.role === 'ADMIN' ? [{ to: '/team', icon: Users, label: 'Team' }] : []),
  ]

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <Terminal size={15} color="#fff" />
        </div>
        <span className="logo-text">TaskFlow</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Menu</span>
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

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-card" style={{ marginBottom: '6px' }}>
          <div
            className="avatar"
            style={{ width: 28, height: 28, background: getColor(user?.name || ''), color: '#fff', fontSize: '10px' }}
          >
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.role === 'ADMIN' ? 'Administrator' : 'Member'}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="nav-item"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

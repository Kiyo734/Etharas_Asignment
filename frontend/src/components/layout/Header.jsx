import { useAuth } from '../../contexts/AuthContext'

export default function Header({ title, subtitle, actions }) {
  const { user } = useAuth()

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {actions}
        <div style={{
          padding: '3px 8px',
          background: user?.role === 'ADMIN' ? 'rgba(168,85,247,0.1)' : 'rgba(100,116,139,0.1)',
          border: `1px solid ${user?.role === 'ADMIN' ? 'rgba(168,85,247,0.2)' : 'rgba(100,116,139,0.2)'}`,
          borderRadius: '5px',
          fontSize: '11px',
          fontWeight: 600,
          color: user?.role === 'ADMIN' ? '#c084fc' : '#94a3b8',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {user?.role}
        </div>
      </div>
    </div>
  )
}

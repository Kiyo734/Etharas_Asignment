export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  const cls = size === 'lg' ? 'spinner spinner-lg' : 'spinner'

  if (fullPage) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className={cls} style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
      <div className={cls} style={{ color: 'var(--accent)' }} />
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Layers, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

const perks = [
  'Kanban boards with drag-and-drop',
  'Role-based access for your team',
  'Real-time progress tracking',
  'Overdue task alerts & analytics',
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setError('')
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials')
    }
  }

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px' }}>
              <div className="logo-mark">
                <Layers size={18} color="#fff" />
              </div>
              <span className="logo-text">TaskFlow</span>
            </div>

            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '99px', padding: '4px 12px', marginBottom: '20px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-light)', letterSpacing: '0.04em' }}>NOW LIVE</span>
              </div>
              <h1 style={{ fontSize: '34px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '14px' }}>
                Your team's<br />command center.
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.65 }}>
                Assign tasks, track progress, and ship projects on time — all in one place.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {perks.map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={15} color="var(--accent-light)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo box */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '10px' }}>
              Try with demo accounts
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { role: 'Admin', email: 'admin@taskmanager.com', pass: 'admin123' },
                { role: 'Member', email: 'alice@taskmanager.com', pass: 'user123' },
              ].map((d) => (
                <div key={d.role} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--surface-2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-light)', background: 'rgba(124,58,237,0.12)', padding: '2px 7px', borderRadius: '4px', flexShrink: 0 }}>{d.role}</span>
                  <span className="mono" style={{ color: 'var(--text-2)', fontSize: '11px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.email}</span>
                  <span className="mono" style={{ color: 'var(--text-3)', fontSize: '11px', flexShrink: 0 }}>{d.pass}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.6px', marginBottom: '8px' }}>
              Sign in
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>
              Enter your credentials to access your workspace
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: '20px', padding: '13px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="field">
              <label className="field-label">Email address</label>
              <input type="email" className={`input ${errors.email ? 'error' : ''}`} placeholder="you@company.com" autoComplete="email" {...register('email')} />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input type="password" className={`input ${errors.password ? 'error' : ''}`} placeholder="••••••••" autoComplete="current-password" {...register('password')} />
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting} style={{ width: '100%', marginTop: '4px' }}>
              {isSubmitting ? <span className="spinner" /> : null}
              Continue
              <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px', color: 'var(--text-3)' }}>
            New to TaskFlow?{' '}
            <Link to="/register" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

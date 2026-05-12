import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, ArrowRight, Shield, GitBranch, BarChart3 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

const features = [
  { icon: GitBranch, text: 'Kanban boards & sprint tracking' },
  { icon: Shield, text: 'Role-based access control' },
  { icon: BarChart3, text: 'Real-time analytics dashboard' },
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
      {/* Left */}
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
            <div className="logo-mark">
              <Zap size={16} color="#000" />
            </div>
            <span className="logo-text" style={{ fontSize: '18px' }}>TaskFlow</span>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '12px' }}>
              Manage projects<br />
              <span className="glow-text">like a pro.</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6 }}>
              The task manager built for engineering teams. Assign, track, and ship faster.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            {features.map((f) => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={14} color="var(--accent)" />
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Demo credentials */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '8px' }}>
              Demo Credentials
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.8 }}>
              <div><span style={{ color: 'var(--text-3)' }}>Admin:</span> <span className="mono" style={{ color: 'var(--accent)' }}>admin@taskmanager.com</span> / admin123</div>
              <div><span style={{ color: 'var(--text-3)' }}>Member:</span> <span className="mono" style={{ color: 'var(--accent)' }}>alice@taskmanager.com</span> / user123</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-3)', position: 'relative', zIndex: 1 }}>
          © 2024 TaskFlow · Built for teams that ship
        </div>
      </div>

      {/* Right */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.4px', marginBottom: '6px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>
              Sign in to continue to your workspace
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: '18px', padding: '12px 14px', background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.2)', borderRadius: '8px', fontSize: '13px', color: '#ff6680' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Email address</label>
              <input type="email" className={`input ${errors.email ? 'error' : ''}`} placeholder="you@company.com" autoComplete="email" {...register('email')} />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input type="password" className={`input ${errors.password ? 'error' : ''}`} placeholder="Enter your password" autoComplete="current-password" {...register('password')} />
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting} style={{ marginTop: '6px', width: '100%' }}>
              {isSubmitting ? <span className="spinner" /> : <Zap size={15} />}
              Sign in
              <ArrowRight size={15} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-3)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

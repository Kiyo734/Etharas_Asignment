import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Terminal, ArrowRight, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

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
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div className="logo-mark">
                <Terminal size={16} color="#fff" />
              </div>
              <span className="logo-text">TaskFlow</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '10px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.5 }}>
              Sign in to continue managing your projects and tasks
            </p>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Lock size={14} color="var(--text-3)" />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Demo Accounts</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6 }}>
              <div style={{ marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-3)' }}>Admin:</span> <span className="mono" style={{ color: 'var(--accent)' }}>admin@taskmanager.com</span> / admin123
              </div>
              <div>
                <span style={{ color: 'var(--text-3)' }}>Member:</span> <span className="mono" style={{ color: 'var(--accent)' }}>alice@taskmanager.com</span> / user123
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-3)', position: 'relative', zIndex: 1 }}>
          © 2024 TaskFlow. Built for teams that ship.
        </div>
      </div>

      {/* Right */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          {error && (
            <div style={{ marginBottom: '16px', padding: '12px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', fontSize: '13px', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Email address</label>
              <input
                type="email"
                className={`input ${errors.email ? 'error' : ''}`}
                placeholder="you@company.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input
                type="password"
                className={`input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting} style={{ marginTop: '8px' }}>
              {isSubmitting ? <span className="spinner" /> : null}
              Sign in
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-3)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

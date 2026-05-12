import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Terminal, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MEMBER']),
})

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'MEMBER' },
  })

  const onSubmit = async (data) => {
    setError('')
    try {
      await registerUser(data.name, data.email, data.password, data.role)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      {/* Left */}
      <div className="auth-left">
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div className="logo-mark">
              <Terminal size={16} color="#fff" />
            </div>
            <span className="logo-text">TaskFlow</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '10px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-3)', lineHeight: 1.5, marginBottom: '32px' }}>
            Join your team on TaskFlow and start managing projects together.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Projects', value: '10K+' },
              { label: 'Tasks Done', value: '500K+' },
              { label: 'Teams', value: '2K+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 16px' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.5px' }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
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

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="field">
              <label className="field-label">Full name</label>
              <input type="text" className={`input ${errors.name ? 'error' : ''}`} placeholder="John Doe" autoComplete="name" {...register('name')} />
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>

            <div className="field">
              <label className="field-label">Email address</label>
              <input type="email" className={`input ${errors.email ? 'error' : ''}`} placeholder="you@company.com" autoComplete="email" {...register('email')} />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input type="password" className={`input ${errors.password ? 'error' : ''}`} placeholder="Min. 6 characters" autoComplete="new-password" {...register('password')} />
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>

            <div className="field">
              <label className="field-label">Role</label>
              <select className="input" {...register('role')}>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting} style={{ marginTop: '6px' }}>
              {isSubmitting ? <span className="spinner" /> : null}
              Create account
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Layers, ArrowRight } from 'lucide-react'
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
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '56px' }}>
            <div className="logo-mark">
              <Layers size={18} color="#fff" />
            </div>
            <span className="logo-text">TaskFlow</span>
          </div>

          <h1 style={{ fontSize: '34px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '14px' }}>
            Start shipping<br />faster today.
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '40px' }}>
            Join thousands of teams using TaskFlow to manage projects and hit deadlines.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { n: '10K+', l: 'Projects' },
              { n: '500K+', l: 'Tasks Done' },
              { n: '2K+', l: 'Teams' },
              { n: '99.9%', l: 'Uptime' },
            ].map((s) => (
              <div key={s.l} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-light)', letterSpacing: '-0.5px' }}>{s.n}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '3px', fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.6px', marginBottom: '8px' }}>
              Create account
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-3)' }}>
              Free forever. No credit card required.
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: '20px', padding: '13px 16px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', fontSize: '13px', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting} style={{ width: '100%', marginTop: '4px' }}>
              {isSubmitting ? <span className="spinner" /> : null}
              Create account
              <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px', color: 'var(--text-3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-light)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

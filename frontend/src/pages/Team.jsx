import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, CheckSquare, FolderOpen } from 'lucide-react'
import Header from '../components/layout/Header'
import Avatar from '../components/ui/Avatar'
import { RoleBadge } from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useToast } from '../components/ui/Toast'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

export default function Team() {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(r => r.data),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => api.patch(`/users/${id}/role`, { role }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast(`Role updated to ${vars.role}`, 'success')
    },
    onError: (err) => toast(err.response?.data?.error || 'Failed to update role', 'error'),
  })

  const users = data?.users || []
  const admins = users.filter(u => u.role === 'ADMIN').length
  const members = users.filter(u => u.role === 'MEMBER').length

  return (
    <>
      <Header title="Team" subtitle="Manage members and roles" />
      <div className="page">
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Members', value: users.length, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Admins', value: admins, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
            { label: 'Members', value: members, color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <Users size={18} color={s.color} />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Tasks</th>
                  <th>Projects</th>
                  {currentUser?.role === 'ADMIN' && <th>Change Role</th>}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar name={u.name} size="md" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {u.name}
                            {u.id === currentUser?.id && (
                              <span style={{ fontSize: '10px', color: 'var(--accent)', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="mono" style={{ color: 'var(--text-2)', fontSize: '12px' }}>{u.email}</span>
                    </td>
                    <td><RoleBadge role={u.role} /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-2)' }}>
                        <CheckSquare size={12} color="var(--text-3)" />
                        {u._count?.assignedTasks || 0}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-2)' }}>
                        <FolderOpen size={12} color="var(--text-3)" />
                        {u._count?.projectMembers || 0}
                      </div>
                    </td>
                    {currentUser?.role === 'ADMIN' && (
                      <td>
                        {u.id !== currentUser?.id ? (
                          <select
                            value={u.role}
                            onChange={e => roleMutation.mutate({ id: u.id, role: e.target.value })}
                            className="input"
                            style={{ width: '120px', padding: '5px 8px', fontSize: '12px' }}
                          >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

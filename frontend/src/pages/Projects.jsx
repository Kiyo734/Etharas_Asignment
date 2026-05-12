import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, FolderOpen, Search } from 'lucide-react'
import Header from '../components/layout/Header'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectModal from '../components/projects/ProjectModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import api from '../api/axios'

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

export default function Projects() {
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['projects', statusFilter],
    queryFn: () => api.get('/projects', { params: statusFilter ? { status: statusFilter } : {} }).then(r => r.data),
  })

  const projects = (data?.projects || []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header
        title="Projects"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={14} /> New Project
          </button>
        }
      />
      <div className="page">
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
          <div className="filter-bar">
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`filter-chip${statusFilter === f.value ? ' active' : ''}`}
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="input search-input"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '200px', padding: '6px 10px 6px 30px' }}
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects found"
            description="Create your first project to get started"
            action={
              <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                <Plus size={14} /> New Project
              </button>
            }
          />
        ) : (
          <div className="grid-3">
            {projects.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>

      <ProjectModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

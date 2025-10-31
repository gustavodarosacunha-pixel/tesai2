import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, Projector, User } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { cn } from '@/lib/utils'

export const AppLayout = () => {
  const projects = useProjectStore((state) => state.projects)

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <Projector className="h-5 w-5 text-brand-600" />
            <span>SmartProjectAI</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-600">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn('hidden items-center gap-2 sm:flex', isActive && 'text-brand-600 font-semibold')
              }
            >
              <Menu className="h-4 w-4" />
              Dashboard
            </NavLink>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
              <User className="h-4 w-4" />
              <span>beta@smartproject.ai</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-soft lg:block">
          <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Projetos</div>
          <ul className="space-y-2 text-sm">
            {projects.map((project) => (
              <li key={project.id}>
                <NavLink
                  to={`/projects/${project.id}`}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2 transition hover:bg-slate-100',
                      isActive && 'bg-brand-50 text-brand-700'
                    )
                  }
                >
                  <div className="font-medium">{project.name}</div>
                  <div className="text-xs text-slate-500">
                    Atualizado em {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-h-[70vh]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

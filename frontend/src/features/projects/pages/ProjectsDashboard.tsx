import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Layers, Plus, Zap } from 'lucide-react'
import type { Project } from '@/types/project'
import { useProjectStore } from '@/store/projectStore'
import { formatDate } from '@/lib/utils'

const statusStyles: Record<Project['status'], { label: string; className: string }> = {
  on_track: { label: 'No prazo', className: 'bg-emerald-100 text-emerald-700' },
  at_risk: { label: 'Em risco', className: 'bg-amber-100 text-amber-700' },
  delayed: { label: 'Atrasado', className: 'bg-rose-100 text-rose-700' },
}

export const ProjectsDashboard = () => {
  const projects = useProjectStore((state) => state.projects)
  const createProject = useProjectStore((state) => state.createProject)

  const metrics = useMemo(() => {
    return projects.reduce(
      (acc, project) => {
        acc.total += 1
        acc[project.status] = (acc[project.status] ?? 0) + 1
        return acc
      },
      { total: 0, on_track: 0, at_risk: 0, delayed: 0 } as Record<Project['status'] | 'total', number>,
    )
  }, [projects])

  const handleCreateProject = () => {
    const id = `proj-${crypto.randomUUID().slice(0, 6)}`
    const timestamp = new Date().toISOString()

    createProject({
      id,
      name: 'Novo Projeto',
      description: 'Projeto criado rapidamente para experimentacao.',
      owner: 'voce@smartproject.ai',
      status: 'on_track',
      updatedAt: timestamp,
      defaultAssignees: ['Voce'],
      tasks: [],
    })
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Bem-vindo ao SmartProjectAI</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Central de projetos inteligente</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Visualize seu portfolio, acompanhe riscos e utilize o Gemini Flash 2.5 para sugerir proximos passos.
            </p>
          </div>
          <button className="btn-primary self-start" onClick={handleCreateProject}>
            <Plus className="h-4 w-4" /> Novo projeto
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Projetos ativos" value={metrics.total} icon={<Layers className="h-8 w-8 text-brand-500" />} />
        <DashboardCard title="No prazo" value={metrics.on_track} icon={<Zap className="h-8 w-8 text-emerald-500" />} />
        <DashboardCard title="Em risco" value={metrics.at_risk} icon={<Clock className="h-8 w-8 text-amber-500" />} />
        <DashboardCard title="Atrasados" value={metrics.delayed} icon={<Clock className="h-8 w-8 text-rose-500" />} />
      </section>

      <section className="space-y-4">
        <header>
          <h2 className="text-xl font-semibold text-slate-900">Projetos recentes</h2>
          <p className="text-sm text-slate-500">Selecione um projeto para editar tarefas, visualizar o cronograma e acionar o agente de IA.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => {
            const status = statusStyles[project.status]
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-600">{project.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Owner: {project.owner}</span>
                  <span>Atualizado {formatDate(project.updatedAt)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

type DashboardCardProps = {
  title: string
  value: number
  icon: React.ReactNode
}

const DashboardCard = ({ title, value, icon }: DashboardCardProps) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      </div>
      {icon}
    </div>
  </article>
)

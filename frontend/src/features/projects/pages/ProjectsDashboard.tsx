import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Clock, Zap, Layers } from 'lucide-react'
import { useProjectStore, selectProjects } from '@/store/projectStore'
import { formatDate } from '@/lib/utils'

const statusLabels: Record<string, { label: string; color: string }> = {
  on_track: { label: 'No prazo', color: 'bg-emerald-100 text-emerald-700' },
  at_risk: { label: 'Em risco', color: 'bg-amber-100 text-amber-700' },
  delayed: { label: 'Atrasado', color: 'bg-rose-100 text-rose-700' },
}

export const ProjectsDashboard = () => {
  const projects = useProjectStore(selectProjects)
  const { actions } = useProjectStore((state) => ({ actions: state.actions }))

  const metrics = useMemo(() => {
    const total = projects.length
    const statusCount = projects.reduce(
      (acc, project) => ({ ...acc, [project.status]: (acc[project.status] ?? 0) + 1 }),
      { on_track: 0, at_risk: 0, delayed: 0 }
    )

    return {
      total,
      onTrack: statusCount.on_track,
      atRisk: statusCount.at_risk,
      delayed: statusCount.delayed,
    }
  }, [projects])

  const handleCreateProject = () => {
    const newId = `proj-${crypto.randomUUID().slice(0, 6)}`
    const today = new Date().toISOString()

    actions.createProject({
      id: newId,
      name: 'Novo Projeto',
      description: 'Projeto criado rapidamente para prototipagem.',
      owner: 'voce@smartproject.ai',
      status: 'on_track',
      updatedAt: today,
      defaultAssignees: ['Voce'],
      tasks: [],
    })
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Bem-vindo ao SmartProjectAI</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Central de projetos inteligente</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Visualize seus projetos ativos, acompanhe riscos rapidamente e deixe o assistente sugerir os proximos passos.
            </p>
          </div>
          <button onClick={handleCreateProject} className="btn-primary self-start">
            <Plus className="h-4 w-4" />
            Novo projeto
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Projetos ativos</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{metrics.total}</p>
            </div>
            <Layers className="h-8 w-8 text-brand-500" />
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">No prazo</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-600">{metrics.onTrack}</p>
            </div>
            <Zap className="h-8 w-8 text-emerald-500" />
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Em risco</p>
              <p className="mt-2 text-3xl font-semibold text-amber-500">{metrics.atRisk}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Atrasados</p>
              <p className="mt-2 text-3xl font-semibold text-rose-500">{metrics.delayed}</p>
            </div>
            <Clock className="h-8 w-8 text-rose-500" />
          </div>
        </article>
      </section>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Projetos recentes</h2>
            <p className="text-sm text-slate-500">Escolha um projeto para ver detalhes, tarefas e conversar com o assistente.</p>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => {
            const status = statusLabels[project.status]
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-600">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status?.color ?? 'bg-slate-100 text-slate-600'}`}>
                    {status?.label ?? 'Em analise'}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Owner: {project.owner}</span>
                  <span>Atualizado em {formatDate(project.updatedAt)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

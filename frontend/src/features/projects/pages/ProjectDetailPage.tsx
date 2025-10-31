import { useEffect, useMemo, useState, type ComponentType, type SVGProps } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar, Users, LayoutGrid } from 'lucide-react'
import { TaskGrid } from '@/features/tasks/components/TaskGrid'
import { TaskGantt } from '@/features/tasks/components/TaskGantt'
import { AIAssistantPanel } from '@/features/ai/components/AIAssistantPanel'
import { useProjectStore, selectCurrentProject } from '@/store/projectStore'
import type { Task } from '@/types/project'
import { formatDate, formatStatus } from '@/lib/utils'

type ViewMode = 'grid' | 'gantt'

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const { project, actions } = useProjectStore((state) => ({
    project: selectCurrentProject(state),
    actions: state.actions,
  }))

  useEffect(() => {
    if (projectId) {
      actions.selectProject(projectId)
    }
  }, [projectId, actions])

  useEffect(() => {
    if (!project && projectId) {
      navigate('/')
    }
  }, [project, projectId, navigate])

  const summary = useMemo(() => {
    if (!project) return null
    const totalTasks = project.tasks.length
    const completed = project.tasks.filter((task) => task.status === 'completed').length
    const inProgress = project.tasks.filter((task) => task.status === 'in_progress').length
    return { totalTasks, completed, inProgress }
  }, [project])

  if (!project) {
    return null
  }

  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-${crypto.randomUUID().slice(0, 6)}`,
      name: 'Nova tarefa',
      assignee: project.defaultAssignees[0] ?? 'Responsavel',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'not_started',
      dependencies: [],
    }
    actions.createTask(project.id, newTask)
  }

  const handleUpdateTask = (taskId: string, patch: Partial<Task>) => {
    actions.updateTask(project.id, { ...patch, id: taskId })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-600">Projeto</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">{project.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <span>Owner: {project.owner}</span>
                <span>Status: {formatStatus(project.status)}</span>
                <span>Atualizado em {formatDate(project.updatedAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700">
              <SparkIcon className="h-4 w-4" />
              Assistido pelo agente de IA
            </div>
          </div>

          {summary && (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <MetricCard icon={LayoutGrid} label="Total de tarefas" value={summary.totalTasks} color="text-slate-700" />
              <MetricCard icon={Users} label="Em andamento" value={summary.inProgress} color="text-amber-500" />
              <MetricCard icon={Calendar} label="Concluidas" value={summary.completed} color="text-emerald-600" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Planejamento</h2>
          <div className="flex gap-2 rounded-full border border-slate-200 bg-white p-1 text-xs">
            <button
              className={`rounded-full px-4 py-1.5 ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-600'}`}
              onClick={() => setViewMode('grid')}
            >
              Tabela
            </button>
            <button
              className={`rounded-full px-4 py-1.5 ${viewMode === 'gantt' ? 'bg-brand-600 text-white' : 'text-slate-600'}`}
              onClick={() => setViewMode('gantt')}
            >
              Gantt
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <TaskGrid projectId={project.id} tasks={project.tasks} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} />
        ) : (
          <TaskGantt tasks={project.tasks} />
        )}
      </div>

      <AIAssistantPanel />
    </div>
  )
}

type MetricCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  value: number
  color: string
}

const MetricCard = ({ icon: Icon, label, value, color }: MetricCardProps) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
    <Icon className={`h-6 w-6 ${color}`} />
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  </div>
)

const SparkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

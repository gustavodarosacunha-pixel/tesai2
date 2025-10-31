import type { Task } from '@/types/project'
import { taskStatusOptions } from '@/store/projectStore'

type TaskGridProps = {
  projectId: string
  tasks: Task[]
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void
  onAddTask: () => void
}

export const TaskGrid = ({ projectId, tasks, onUpdateTask, onAddTask }: TaskGridProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Plano de tarefas</h3>
        <p className="text-sm text-slate-500">Edite diretamente a grade para ajustar datas, responsaveis e status.</p>
      </div>
      <button className="btn-secondary" onClick={onAddTask}>
        + Adicionar tarefa
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3 text-left">Nome</th>
            <th className="px-4 py-3 text-left">Responsavel</th>
            <th className="px-4 py-3 text-left">Inicio</th>
            <th className="px-4 py-3 text-left">Fim</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Dependencias</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <input
                  className="w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
                  value={task.name}
                  onChange={(event) => onUpdateTask(task.id, { name: event.target.value })}
                  placeholder="Nome da tarefa"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  className="w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
                  value={task.assignee}
                  onChange={(event) => onUpdateTask(task.id, { assignee: event.target.value })}
                  placeholder="Responsavel"
                  list={`${projectId}-assignees`}
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="date"
                  className="w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
                  value={task.startDate}
                  onChange={(event) => onUpdateTask(task.id, { startDate: event.target.value })}
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="date"
                  className="w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
                  value={task.endDate}
                  onChange={(event) => onUpdateTask(task.id, { endDate: event.target.value })}
                />
              </td>
              <td className="px-4 py-3">
                <select
                  className="w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
                  value={task.status}
                  onChange={(event) => onUpdateTask(task.id, { status: event.target.value as Task['status'] })}
                >
                  {taskStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <input
                  className="w-full rounded-lg border border-transparent bg-slate-100 px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
                  value={task.dependencies.join(', ')}
                  onChange={(event) =>
                    onUpdateTask(task.id, {
                      dependencies: event.target.value
                        .split(',')
                        .map((dependency) => dependency.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="IDs separados por virgula"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <datalist id={`${projectId}-assignees`}>
      {Array.from(new Set(tasks.map((task) => task.assignee))).map((assignee) => (
        <option key={assignee} value={assignee} />
      ))}
    </datalist>
  </div>
)

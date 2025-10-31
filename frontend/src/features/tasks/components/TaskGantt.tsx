import { differenceInCalendarDays, eachDayOfInterval, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Task } from '@/types/project'

type TaskGanttProps = {
  tasks: Task[]
}

export const TaskGantt = ({ tasks }: TaskGanttProps) => {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Nenhuma tarefa para exibir no momento. Crie tarefas na vis?o tabela para visualizar o cronograma aqui.
      </div>
    )
  }

  const parsedTasks = tasks.map((task) => ({
    ...task,
    start: new Date(task.startDate),
    end: new Date(task.endDate),
  }))

  const minDate = parsedTasks.reduce((min, task) => (task.start < min ? task.start : min), parsedTasks[0].start)
  const maxDate = parsedTasks.reduce((max, task) => (task.end > max ? task.end : max), parsedTasks[0].end)
  const totalDays = Math.max(differenceInCalendarDays(maxDate, minDate) + 1, 1)

  const calendar = eachDayOfInterval({ start: minDate, end: maxDate })

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Cronograma (Gantt simplificado)</h3>
      </div>

      <div className="overflow-x-auto px-6 py-4">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[240px_1fr] text-xs font-medium uppercase tracking-wide text-slate-500">
            <div>Tarefa</div>
            <div className="relative">
              <div className="absolute inset-0 flex">
                {calendar.map((day) => (
                  <div key={day.toISOString()} className="flex-1 border-l border-slate-100 text-[11px] text-slate-400">
                    {format(day, 'dd/MM', { locale: ptBR })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {parsedTasks.map((task) => {
              const startOffset = differenceInCalendarDays(task.start, minDate)
              const duration = Math.max(differenceInCalendarDays(task.end, task.start) + 1, 1)
              const left = (startOffset / totalDays) * 100
              const width = (duration / totalDays) * 100

              return (
                <div key={task.id} className="grid grid-cols-[240px_1fr] items-center gap-4 text-sm">
                  <div>
                    <div className="font-medium text-slate-800">{task.name}</div>
                    <div className="text-xs text-slate-500">{task.assignee}</div>
                  </div>
                  <div className="relative h-10 rounded-lg bg-slate-100">
                    <div
                      className="absolute top-1 left-0 flex h-8 items-center rounded-full bg-brand-500 px-3 text-xs font-semibold text-white shadow-sm"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      {format(task.start, 'dd/MM', { locale: ptBR })} - {format(task.end, 'dd/MM', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

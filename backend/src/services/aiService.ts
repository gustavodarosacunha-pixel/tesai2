import { randomUUID } from 'node:crypto'
import { addDays, formatISO } from 'date-fns'
import { AIActionRequest, AIActionResponse, Task } from '../types/project'
import { projectService } from './projectService'

const createTaskFromSuggestion = (projectId: string, baseName: string): Task => {
  const now = new Date()
  const start = addDays(now, 1)
  const end = addDays(start, 3)

  return {
    id: `${projectId}-task-${randomUUID().slice(0, 6)}`,
    name: baseName,
    assignee: 'Equipe AI',
    startDate: formatISO(start, { representation: 'date' }),
    endDate: formatISO(end, { representation: 'date' }),
    status: 'not_started',
    dependencies: [],
    description: 'Gerado automaticamente pelo assistente SmartProjectAI.'
  }
}

const suggestionsByIntent: Record<AIActionRequest['intent'], string[]> = {
  generate_wbs: [
    'Reunir stakeholders para alinhar escopo definitivo',
    'Identificar entregaveis principais e subentregaveis',
    'Definir milestones e criterio de aceite',
  ],
  suggest_next_steps: [
    'Revisar status das tarefas criticas',
    'Validar agenda e disponibilidade dos responsaveis',
    'Atualizar comunicados aos patrocinadores',
  ],
  update_status: [
    'Avaliar indicadores de progresso semanal',
    'Registrar riscos identificados nas ultimas reunioes',
    'Enviar resumo executivo aos sponsors',
  ],
  custom: [
    'Registrar feedback da equipe sobre o uso do SmartProjectAI',
    'Cruzar cronograma com alocacao de recursos para detectar conflitos',
  ],
}

export const aiService = {
  async handleAction(request: AIActionRequest): Promise<AIActionResponse> {
    const project = projectService.getProject(request.projectId)
    if (!project) {
      throw new Error(`Projeto ${request.projectId} nao encontrado`)
    }

    const baseSuggestions = suggestionsByIntent[request.intent]
    const suggestions = baseSuggestions.map((suggestion) => `${suggestion}.`)

    let updatedProject = project
    let createdTasks: Task[] | undefined

    if (request.intent === 'generate_wbs') {
      const newTasks = [
        createTaskFromSuggestion(project.id, 'Planejar backlog detalhado com assistente'),
        createTaskFromSuggestion(project.id, 'Mapear dependencias criticas do MVP'),
      ]

      newTasks.forEach((task) => {
        const result = projectService.createTask(project.id, task)
        if (result) {
          updatedProject = result
        }
      })

      createdTasks = newTasks
    }

    projectService.upsertProject({ ...updatedProject, updatedAt: new Date().toISOString() })

    return {
      project: updatedProject,
      summary: `Assistente respondeu a solicitacao '${request.intent}' com foco no projeto ${project.name}.`,
      suggestions,
      createdTasks,
    }
  }
}

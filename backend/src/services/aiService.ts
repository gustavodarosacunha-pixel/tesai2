import { randomUUID } from 'node:crypto'
import { addDays, formatISO } from 'date-fns'
import type { AIActionRequest, AIActionResponse, Task } from '../types/project'
import { projectService } from './projectService'

const fallbackSuggestions: Record<AIActionRequest['intent'], string[]> = {
  generate_wbs: [
    'Mapear entregaveis e sub-entregaveis do MVP',
    'Identificar dependencias criticas entre as principais tarefas',
    'Planejar checkpoints de validacao com stakeholders',
  ],
  suggest_next_steps: [
    'Revisar progresso das tarefas criticas desta semana',
    'Atualizar o status dos responsaveis e confirmar disponibilidade',
    'Preparar resumo executivo para sponsors do projeto',
  ],
  update_status: [
    'Consolidar status das tarefas e registrar riscos em aberto',
    'Ajustar datas de conclusao conforme andamento real',
    'Compartilhar resumo atualizado com o time do projeto',
  ],
  custom: [
    'Validar se ha bloqueios logisticos ou dependencias externas',
    'Coletar feedback da equipe sobre a utilizacao do SmartProjectAI',
  ],
}

const buildTaskFromSuggestion = (projectId: string, name: string): Task => {
  const start = addDays(new Date(), 1)
  const end = addDays(start, 3)

  return {
    id: `${projectId}-task-${randomUUID().slice(0, 6)}`,
    name,
    assignee: 'Equipe IA',
    startDate: formatISO(start, { representation: 'date' }),
    endDate: formatISO(end, { representation: 'date' }),
    status: 'not_started',
    dependencies: [],
    description: 'Tarefa sugerida automaticamente pelo assistente Gemini.',
  }
}

export const aiService = {
  async handleAction(request: AIActionRequest): Promise<AIActionResponse> {
    const project = projectService.getProject(request.projectId)
    if (!project) {
      throw new Error(`Projeto ${request.projectId} nao encontrado`)
    }

    const suggestions = fallbackSuggestions[request.intent] ?? fallbackSuggestions.custom
    let updatedProject = project
    let createdTasks: Task[] | undefined

    if (request.intent === 'generate_wbs') {
      const generated = [
        buildTaskFromSuggestion(project.id, 'Desenhar EAP completa com o assistente'),
        buildTaskFromSuggestion(project.id, 'Priorizar entregaveis criticos do MVP'),
      ]

      generated.forEach((task) => {
        const result = projectService.createTask(project.id, task)
        if (result) {
          updatedProject = result
        }
      })

      createdTasks = generated
    }

    const summary = `Assistente Gemini analisou o projeto '${project.name}' (intent: ${request.intent}).`
    const responseProject = projectService.upsertProject({ ...updatedProject, updatedAt: new Date().toISOString() })

    return {
      project: responseProject,
      summary,
      suggestions,
      createdTasks,
    }
  },
}

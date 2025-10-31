import { randomUUID } from 'node:crypto'
import { addDays, formatISO } from 'date-fns'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { AIActionRequest, AIActionResponse, Task, TaskStatus } from '../types/project'
import { projectService } from './projectService'

interface GeminiTaskPlan {
  name: string
  description?: string
  assignee?: string
  startOffsetDays?: number
  durationDays?: number
  status?: TaskStatus
  dependencies?: string[]
}

interface GeminiPlanResponse {
  summary?: string
  suggestions?: string[]
  tasks?: GeminiTaskPlan[]
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

const geminiClient = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null

const cleanJson = (value: string) => value.replace(/```json|```/g, '').trim()

const fetchPlanFromGemini = async (
  request: AIActionRequest,
  projectSnapshot: unknown,
): Promise<GeminiPlanResponse | null> => {
  if (!geminiClient) {
    return null
  }

  try {
    const model = geminiClient.getGenerativeModel({
      model: env.geminiModel,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
        topP: 0.95,
        topK: 32,
      },
    })

    const guidance = `Voce e o assistente do SmartProjectAI. Analise o projeto fornecido e responda em formato JSON com as seguintes chaves:
{
  "summary": string,
  "suggestions": string[],
  "tasks": [
    {
      "name": string,
      "description"?: string,
      "assignee"?: string,
      "startOffsetDays"?: number,
      "durationDays"?: number,
      "status"?: "not_started" | "in_progress" | "at_risk" | "blocked" | "completed",
      "dependencies"?: string[]
    }
  ]
}
Sempre responda em Portugues do Brasil. Utilize tarefas apenas quando fizer sentido para a intencao.`

    const payload = `Contexto do projeto:
${JSON.stringify(projectSnapshot, null, 2)}

Intencao do usuario: ${request.intent}
Mensagem do usuario: ${request.message}

Forneca "tasks" apenas quando for necessario criar/atualizar atividades. Para sugerir tarefas novas, prefira duracoes curtas (1-5 dias) e datas relativas usando offset.`

    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${guidance}\n\n${payload}`,
            },
          ],
        },
      ],
    })

    const text = response.response?.text()?.trim()
    if (!text) {
      return null
    }

    const parsed = JSON.parse(cleanJson(text)) as GeminiPlanResponse
    return parsed
  } catch (error) {
    console.warn('Falha ao consultar Gemini, usando sugestoes locais.', error)
    return null
  }
}

const buildTasksFromPlan = (projectId: string, plans: GeminiTaskPlan[]): Task[] => {
  const today = new Date()

  return plans.map((plan) => {
    const startOffset = plan.startOffsetDays ?? 1
    const duration = Math.max(plan.durationDays ?? 3, 1)
    const startDate = addDays(today, startOffset)
    const endDate = addDays(startDate, Math.max(duration - 1, 0))

    return {
      id: `${projectId}-task-${randomUUID().slice(0, 6)}`,
      name: plan.name,
      assignee: plan.assignee ?? 'Equipe Gemini',
      startDate: formatISO(startDate, { representation: 'date' }),
      endDate: formatISO(endDate, { representation: 'date' }),
      status: plan.status ?? 'not_started',
      dependencies: plan.dependencies ?? [],
      description: plan.description ?? 'Gerado automaticamente pelo Gemini Flash 2.5.',
      progress: undefined,
    }
  })
}

export const aiService = {
  async handleAction(request: AIActionRequest): Promise<AIActionResponse> {
    const project = projectService.getProject(request.projectId)
    if (!project) {
      throw new Error(`Projeto ${request.projectId} nao encontrado`)
    }

    const fallbackSuggestions = suggestionsByIntent[request.intent].map((suggestion) => `${suggestion}.`)
    let suggestions = fallbackSuggestions
    let summary = `Assistente Gemini Flash 2.5 gerou sugestoes padrao para a intencao '${request.intent}'.`
    let createdTasks: Task[] | undefined

    const projectSnapshot = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      owner: project.owner,
      defaultAssignees: project.defaultAssignees,
      tasks: project.tasks,
    }

    const geminiPlan = await fetchPlanFromGemini(request, projectSnapshot)

    if (geminiPlan) {
      if (geminiPlan.suggestions && geminiPlan.suggestions.length > 0) {
        suggestions = geminiPlan.suggestions
      }
      if (geminiPlan.summary) {
        summary = geminiPlan.summary
      } else {
        summary = `Assistente Gemini Flash 2.5 analisou o projeto '${project.name}' para a intencao '${request.intent}'.`
      }

      const shouldCreateTasks = request.intent === 'generate_wbs'
      if (shouldCreateTasks && geminiPlan.tasks && geminiPlan.tasks.length > 0) {
        const newTasks = buildTasksFromPlan(project.id, geminiPlan.tasks)
        newTasks.forEach((task) => {
          const result = projectService.createTask(project.id, task)
          if (result) {
            createdTasks = createdTasks ? [...createdTasks, task] : [task]
          }
        })
      }
    }

    const updatedProject = projectService.getProject(request.projectId)
    if (!updatedProject) {
      throw new Error(`Projeto ${request.projectId} nao encontrado apos atualizacao`)
    }

    projectService.upsertProject({ ...updatedProject, updatedAt: new Date().toISOString() })

    return {
      project: updatedProject,
      summary,
      suggestions,
      createdTasks,
    }
  },
}

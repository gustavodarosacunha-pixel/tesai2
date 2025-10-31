import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { addDays, formatISO } from 'date-fns'
import type { AIActionResponse, AIMessage, Project, ProjectSummary, Task, TaskStatus } from '@/types/project'

type ProjectState = {
  projects: Project[]
  selectedProjectId: string | null
  aiMessages: AIMessage[]
  loading: boolean
}

type ProjectActions = {
  selectProject: (projectId: string) => void
  createProject: (project: Project) => void
  updateTask: (projectId: string, task: Partial<Task> & { id: string }) => void
  createTask: (projectId: string, task: Task) => void
  addAiMessage: (message: AIMessage) => void
  setLoading: (value: boolean) => void
  applyAiResponse: (response: AIActionResponse) => void
}

export type ProjectStore = ProjectState & ProjectActions

const now = new Date()
const makeDate = (offset: number) => formatISO(addDays(now, offset), { representation: 'date' })

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Lancamento do Portal SmartProjectAI',
    description: 'Entrega do MVP com dashboard, grid editavel e agente de IA.',
    owner: 'ana.souza@smartproject.ai',
    status: 'on_track',
    updatedAt: formatISO(now),
    defaultAssignees: ['Ana Souza', 'Bruno Nunes', 'Equipe AI'],
    tasks: [
      {
        id: 'task-1',
        name: 'Definir escopo do MVP',
        assignee: 'Ana Souza',
        startDate: makeDate(-4),
        endDate: makeDate(-1),
        status: 'completed',
        dependencies: [],
        description: 'Reunir stakeholders e priorizar funcionalidades essenciais.',
      },
      {
        id: 'task-2',
        name: 'Desenhar arquitetura da solucao',
        assignee: 'Bruno Nunes',
        startDate: makeDate(-1),
        endDate: makeDate(2),
        status: 'in_progress',
        dependencies: ['task-1'],
        description: 'Definir camadas frontend/backend e integra??es com IA.',
      },
      {
        id: 'task-3',
        name: 'Implementar dashboard inicial',
        assignee: 'Ana Souza',
        startDate: makeDate(1),
        endDate: makeDate(5),
        status: 'not_started',
        dependencies: ['task-2'],
      },
      {
        id: 'task-4',
        name: 'Prototipar agente Gemini',
        assignee: 'Equipe AI',
        startDate: makeDate(2),
        endDate: makeDate(6),
        status: 'not_started',
        dependencies: ['task-2'],
      },
    ],
  },
  {
    id: 'proj-2',
    name: 'Onboarding do Cliente Piloto',
    description: 'Preparar materiais e configuracoes para o cliente inicial do SmartProjectAI.',
    owner: 'marcos.ribeiro@smartproject.ai',
    status: 'at_risk',
    updatedAt: formatISO(addDays(now, -1)),
    defaultAssignees: ['Marcos Ribeiro', 'Luiza Faria'],
    tasks: [
      {
        id: 'task-5',
        name: 'Mapear processos atuais',
        assignee: 'Luiza Faria',
        startDate: makeDate(-3),
        endDate: makeDate(0),
        status: 'in_progress',
        dependencies: [],
      },
      {
        id: 'task-6',
        name: 'Configurar ambiente de demo',
        assignee: 'Marcos Ribeiro',
        startDate: makeDate(0),
        endDate: makeDate(3),
        status: 'not_started',
        dependencies: ['task-5'],
      },
      {
        id: 'task-7',
        name: 'Treinamento do time cliente',
        assignee: 'Marcos Ribeiro',
        startDate: makeDate(4),
        endDate: makeDate(7),
        status: 'not_started',
        dependencies: ['task-6'],
      },
    ],
  },
]

const defaultMessages: AIMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Ola! Posso gerar uma EAP ou sugerir proximos passos para o projeto selecionado.',
    createdAt: new Date().toISOString(),
  },
]

export const useProjectStore = create<ProjectStore>()(
  immer((set) => ({
    projects: initialProjects,
    selectedProjectId: initialProjects[0]?.id ?? null,
    aiMessages: defaultMessages,
    loading: false,
    selectProject: (projectId) =>
      set((state) => {
        if (state.selectedProjectId === projectId) return
        state.selectedProjectId = projectId
      }),
    createProject: (project) =>
      set((state) => {
        const timestamp = new Date().toISOString()
        project.updatedAt = timestamp
        state.projects.push(project)
        state.selectedProjectId = project.id
      }),
    updateTask: (projectId, patch) =>
      set((state) => {
        const project = state.projects.find((p) => p.id === projectId)
        if (!project) return
        const task = project.tasks.find((t) => t.id === patch.id)
        if (!task) return
        Object.assign(task, patch)
        project.updatedAt = new Date().toISOString()
      }),
    createTask: (projectId, task) =>
      set((state) => {
        const project = state.projects.find((p) => p.id === projectId)
        if (!project) return
        project.tasks.push(task)
        project.updatedAt = new Date().toISOString()
      }),
    addAiMessage: (message) =>
      set((state) => {
        state.aiMessages.push(message)
      }),
    setLoading: (value) =>
      set((state) => {
        state.loading = value
      }),
    applyAiResponse: (response) =>
      set((state) => {
        const { project } = response
        const timestamp = new Date().toISOString()
        project.updatedAt = timestamp
        const index = state.projects.findIndex((p) => p.id === project.id)
        if (index >= 0) {
          state.projects[index] = project
        } else {
          state.projects.push(project)
        }
        state.selectedProjectId = project.id
      }),
  }))
)

export const selectProjects = (state: ProjectStore): ProjectSummary[] =>
  state.projects.map(({ tasks, ...summary }) => summary)

export const selectCurrentProject = (state: ProjectStore): Project | undefined =>
  state.projects.find((project) => project.id === state.selectedProjectId)

export const selectTasksByProject = (projectId: string) => (state: ProjectStore): Task[] => {
  const project = state.projects.find((p) => p.id === projectId)
  return project?.tasks ?? []
}

export const taskStatusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'not_started', label: 'Nao iniciado' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'at_risk', label: 'Em risco' },
  { value: 'blocked', label: 'Bloqueado' },
  { value: 'completed', label: 'Concluido' },
]

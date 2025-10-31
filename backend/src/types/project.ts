export type TaskStatus = 'not_started' | 'in_progress' | 'at_risk' | 'blocked' | 'completed'

export interface Task {
  id: string
  name: string
  assignee: string
  startDate: string
  endDate: string
  status: TaskStatus
  dependencies: string[]
  description?: string | undefined
  progress?: number | undefined
}

export interface ProjectSummary {
  id: string
  name: string
  description: string
  owner: string
  status: 'on_track' | 'at_risk' | 'delayed'
  updatedAt: string
}

export interface Project extends ProjectSummary {
  tasks: Task[]
  defaultAssignees: string[]
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

export interface AIActionRequest {
  projectId: string
  intent: 'generate_wbs' | 'suggest_next_steps' | 'update_status' | 'custom'
  message: string
}

export interface AIActionResponse {
  project: Project
  summary: string
  suggestions: string[]
  createdTasks?: Task[] | undefined
}

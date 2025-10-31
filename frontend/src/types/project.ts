export type TaskStatus = 'not_started' | 'in_progress' | 'at_risk' | 'blocked' | 'completed'

export interface Task {
  id: string
  name: string
  assignee: string
  startDate: string
  endDate: string
  status: TaskStatus
  dependencies: string[]
  description?: string
  progress?: number
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
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export type AIIntent = 'generate_wbs' | 'suggest_next_steps' | 'update_status' | 'custom'

export interface AIActionResponse {
  project: Project
  summary: string
  suggestions: string[]
  createdTasks?: Task[] | undefined
}

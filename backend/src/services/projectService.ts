import { mockProjects } from '../data/mockData'
import { Project, ProjectSummary, Task } from '../types/project'

export class ProjectService {
  private projects = new Map<string, Project>(mockProjects.map((project) => [project.id, project]))

  listProjects(): ProjectSummary[] {
    return Array.from(this.projects.values()).map(({ tasks, ...summary }) => summary)
  }

  getProject(projectId: string): Project | undefined {
    return this.projects.get(projectId)
  }

  upsertProject(project: Project): Project {
    this.projects.set(project.id, project)
    return project
  }

  updateTask(projectId: string, task: Task): Project | undefined {
    const project = this.projects.get(projectId)
    if (!project) return undefined

    const taskIndex = project.tasks.findIndex((t) => t.id === task.id)

    if (taskIndex >= 0) {
      project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...task }
    } else {
      project.tasks.push(task)
    }

    project.updatedAt = new Date().toISOString()
    this.projects.set(project.id, { ...project, tasks: [...project.tasks] })
    return this.projects.get(projectId)
  }

  createTask(projectId: string, task: Task): Project | undefined {
    const project = this.projects.get(projectId)
    if (!project) return undefined

    project.tasks.push(task)
    project.updatedAt = new Date().toISOString()
    this.projects.set(project.id, { ...project, tasks: [...project.tasks] })
    return this.projects.get(projectId)
  }
}

export const projectService = new ProjectService()

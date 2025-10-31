import { mockProjects } from '../data/mockData'
import type { Project, ProjectSummary, Task } from '../types/project'

class ProjectService {
  private projects = new Map<string, Project>(mockProjects.map((project) => [project.id, structuredClone(project)]))

  listProjects(): ProjectSummary[] {
    return Array.from(this.projects.values()).map((project) => {
      const { tasks, ...summary } = project
      return summary
    })
  }

  getProject(projectId: string): Project | undefined {
    const project = this.projects.get(projectId)
    return project ? structuredClone(project) : undefined
  }

  upsertProject(project: Project): Project {
    const updated = structuredClone(project)
    this.projects.set(project.id, updated)
    return this.getProject(project.id)!
  }

  updateTask(projectId: string, patch: Task): Project | undefined {
    const project = this.projects.get(projectId)
    if (!project) return undefined

    const index = project.tasks.findIndex((task) => task.id === patch.id)
    if (index >= 0) {
      project.tasks[index] = { ...project.tasks[index], ...patch }
    } else {
      project.tasks.push(patch)
    }

    project.updatedAt = new Date().toISOString()
    this.projects.set(projectId, project)
    return this.getProject(projectId)
  }

  createTask(projectId: string, task: Task): Project | undefined {
    return this.updateTask(projectId, task)
  }
}

export const projectService = new ProjectService()

import { Router } from 'express'
import { z } from 'zod'
import { projectService } from '../services/projectService'

const updateTaskSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  assignee: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['not_started', 'in_progress', 'at_risk', 'blocked', 'completed']),
  dependencies: z.array(z.string()).default([]),
  description: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
})

export const projectRoutes = Router()

projectRoutes.get('/', (_req, res) => {
  return res.json({ projects: projectService.listProjects() })
})

projectRoutes.get('/:projectId', (req, res) => {
  const project = projectService.getProject(req.params.projectId)
  if (!project) {
    return res.status(404).json({ message: 'Projeto nao encontrado' })
  }

  return res.json({ project })
})

projectRoutes.put('/:projectId/tasks/:taskId', (req, res) => {
  const parseResult = updateTaskSchema.safeParse({ ...req.body, id: req.params.taskId })

  if (!parseResult.success) {
    return res.status(400).json({ message: 'Dados invalidos', issues: parseResult.error.issues })
  }

  const project = projectService.updateTask(req.params.projectId, parseResult.data)

  if (!project) {
    return res.status(404).json({ message: 'Projeto nao encontrado' })
  }

  return res.json({ project })
})

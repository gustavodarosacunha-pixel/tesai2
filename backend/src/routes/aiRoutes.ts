import { Router } from 'express'
import { z } from 'zod'
import { aiService } from '../services/aiService'

const aiRequestSchema = z.object({
  projectId: z.string(),
  intent: z.enum(['generate_wbs', 'suggest_next_steps', 'update_status', 'custom']),
  message: z.string().min(3),
})

export const aiRoutes = Router()

aiRoutes.post('/actions', async (req, res) => {
  const parseResult = aiRequestSchema.safeParse(req.body)

  if (!parseResult.success) {
    return res.status(400).json({ message: 'Dados invalidos', issues: parseResult.error.issues })
  }

  try {
    const response = await aiService.handleAction(parseResult.data)
    return res.json(response)
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro ao processar acao do assistente',
    })
  }
})

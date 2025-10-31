import { Router } from 'express'
import { z } from 'zod'
import { aiService } from '../services/aiService'

const actionSchema = z.object({
  projectId: z.string(),
  intent: z.enum(['generate_wbs', 'suggest_next_steps', 'update_status', 'custom']),
  message: z.string().min(3),
})

export const aiRoutes = Router()

aiRoutes.post('/actions', async (req, res) => {
  const parse = actionSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ message: 'Dados invalidos', issues: parse.error.issues })
  }

  try {
    const response = await aiService.handleAction(parse.data)
    return res.json(response)
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro ao processar acao do assistente',
    })
  }
})

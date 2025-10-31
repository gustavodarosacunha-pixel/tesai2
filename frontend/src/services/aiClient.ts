import type { AIActionResponse, AIIntent } from '@/types/project'

type AIRequestPayload = {
  projectId: string
  intent: AIIntent
  message: string
}

const fallbackResponse = (payload: AIRequestPayload): AIActionResponse => ({
  project: {
    id: payload.projectId,
    name: 'Projeto mock',
    description: 'Resposta gerada localmente porque o backend nao estava acessivel.',
    owner: 'mock@smartproject.ai',
    status: 'on_track',
    updatedAt: new Date().toISOString(),
    defaultAssignees: ['Equipe AI'],
    tasks: [],
  },
  summary: `Nao foi possivel acessar a API. Mensagem original: ${payload.message}`,
  suggestions: ['Verifique se o servidor backend esta em execucao', 'Confirme a variavel de ambiente OPENAI_API_KEY'],
})

export const aiClient = {
  async act(payload: AIRequestPayload): Promise<AIActionResponse> {
    try {
      const response = await fetch('/api/ai/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Falha na requisicao: ${response.status}`)
      }

      return (await response.json()) as AIActionResponse
    } catch (error) {
      console.warn('Erro chamando agente de IA, usando fallback local.', error)
      return fallbackResponse(payload)
    }
  },
}

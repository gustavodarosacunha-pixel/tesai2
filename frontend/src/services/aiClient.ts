import type { AIActionResponse, AIIntent } from '@/types/project'

type AIRequest = {
  projectId: string
  intent: AIIntent
  message: string
}

const fallbackResponse = (request: AIRequest): AIActionResponse => ({
  project: {
    id: request.projectId,
    name: 'Projeto mock',
    description: 'Resposta gerada localmente porque a API Gemini nao estava acessivel.',
    owner: 'mock@smartproject.ai',
    status: 'on_track',
    updatedAt: new Date().toISOString(),
    defaultAssignees: ['Equipe IA'],
    tasks: [],
  },
  summary: `Nao foi possivel acessar o assistente. Mensagem original: ${request.message}`,
  suggestions: [
    'Verifique se o backend esta em execucao',
    'Confirme a variavel GEMINI_API_KEY no servidor',
  ],
})

export const aiClient = {
  async act(payload: AIRequest): Promise<AIActionResponse> {
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
      console.warn('Erro ao chamar agente Gemini. Retornando fallback.', error)
      return fallbackResponse(payload)
    }
  },
}

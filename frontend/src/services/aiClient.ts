import type { AIActionResponse, AIIntent } from '@/types/project'

type AIRequestPayload = {
  projectId: string
  intent: AIIntent
  message: string
}

const fallbackResponse = (input: AIRequestPayload): AIActionResponse => ({
  project: {
    id: input.projectId,
    name: 'Projeto mock',
    description: 'Resposta gerada localmente porque a API Gemini nao estava acessivel.',
    owner: 'mock@smartproject.ai',
    status: 'on_track',
    updatedAt: new Date().toISOString(),
    defaultAssignees: ['Equipe AI'],
    tasks: [],
  },
  summary: `Nao foi possivel acessar o assistente Gemini. Mensagem original: ${input.message}`,
  suggestions: [
    'Verifique se o backend esta em execucao',
    'Confirme a variavel GEMINI_API_KEY no servidor',
  ],
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
      console.warn('Erro ao chamar o agente Gemini, usando fallback local.', error)
      return fallbackResponse(payload)
    }
  },
}

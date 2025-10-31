import { useState, type FormEvent } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { aiClient } from '@/services/aiClient'
import { useProjectStore } from '@/store/projectStore'
import type { AIIntent } from '@/types/project'

const quickActions: { intent: AIIntent; label: string; message: string }[] = [
  { intent: 'generate_wbs', label: 'Gerar EAP', message: 'Crie uma estrutura analitica do projeto completa.' },
  { intent: 'suggest_next_steps', label: 'Proximos passos', message: 'Quais sao os proximos passos sugeridos?' },
  { intent: 'update_status', label: 'Atualizar status', message: 'Resuma o status atual e destaque riscos.' },
]

export const AIAssistantPanel = () => {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const { selectedProjectId, aiMessages, actions, projects } = useProjectStore((state) => ({
    selectedProjectId: state.selectedProjectId,
    aiMessages: state.aiMessages,
    actions: state.actions,
    projects: state.projects,
  }))

  const currentProject = projects.find((project) => project.id === selectedProjectId)

  const sendMessage = async (intent: AIIntent, message: string) => {
    if (!selectedProjectId || !message) return

    actions.addAiMessage({
      id: `msg-${crypto.randomUUID()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    })

    actions.setLoading(true)

    const response = await aiClient.act({ projectId: selectedProjectId, intent, message })

    actions.applyAiProjectUpdate(response.project)
    actions.addAiMessage({
      id: `msg-${crypto.randomUUID()}`,
      role: 'assistant',
      content: response.summary,
      createdAt: new Date().toISOString(),
    })

    setSuggestions(response.suggestions)
    actions.setLoading(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    await sendMessage('custom', trimmed)
    setInput('')
  }

  const handleQuickAction = async (intent: AIIntent, message: string) => {
    await sendMessage(intent, message)
  }

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Sparkles className="h-4 w-4 text-brand-500" />
          Gemini Flash 2.5
        </div>
        <p className="mt-1 text-xs text-slate-500">
          O agente da Google utiliza o contexto do projeto selecionado para gerar tarefas, atualizar cronogramas e responder duvidas.
        </p>
      </div>

      <div className="border-b border-slate-200 px-5 py-3">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.intent}
              onClick={() => handleQuickAction(action.intent, action.message)}
              className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-100"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {currentProject && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Projeto atual (contexto enviado ao Gemini)</p>
            <p className="mt-1">{currentProject.name}</p>
            <p className="mt-1">Owner: {currentProject.owner}</p>
            <p className="mt-1">Tarefas: {currentProject.tasks.length}</p>
          </div>
        )}

        <div className="space-y-3">
          {aiMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  message.role === 'assistant'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-brand-600 text-white'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {suggestions.length > 0 && (
          <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-xs text-brand-700">
            <p className="font-semibold">Sugestoes geradas</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {suggestions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 focus:border-brand-400 focus:bg-white focus:outline-none"
            placeholder="Pergunte algo ao assistente..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit" className="btn-primary">
            <Send className="h-4 w-4" />
            Enviar
          </button>
        </div>
      </form>
    </aside>
  )
}

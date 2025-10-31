import { addDays, formatISO } from 'date-fns'
import { Project } from '../types/project'

const now = new Date()
const makeDate = (offset: number) => formatISO(addDays(now, offset), { representation: 'date' })

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Lancamento do Portal SmartProjectAI',
    description: 'Entrega do MVP com dashboard responsivo e agente Gemini.',
    owner: 'ana.souza@smartproject.ai',
    status: 'on_track',
    updatedAt: formatISO(now),
    defaultAssignees: ['Ana Souza', 'Bruno Nunes', 'Equipe IA'],
    tasks: [
      {
        id: 'task-1',
        name: 'Definir escopo do MVP',
        assignee: 'Ana Souza',
        startDate: makeDate(-5),
        endDate: makeDate(-2),
        status: 'completed',
        dependencies: [],
        description: 'Alinhar funcionalidades essenciais com stakeholders.',
      },
      {
        id: 'task-2',
        name: 'Arquitetura da solucao',
        assignee: 'Bruno Nunes',
        startDate: makeDate(-1),
        endDate: makeDate(2),
        status: 'in_progress',
        dependencies: ['task-1'],
        description: 'Definir camadas do frontend/backend e integra??es com IA.',
      },
      {
        id: 'task-3',
        name: 'Implementar dashboard inicial',
        assignee: 'Ana Souza',
        startDate: makeDate(1),
        endDate: makeDate(5),
        status: 'not_started',
        dependencies: ['task-2'],
      },
      {
        id: 'task-4',
        name: 'Prototipar assistente Gemini',
        assignee: 'Equipe IA',
        startDate: makeDate(2),
        endDate: makeDate(6),
        status: 'not_started',
        dependencies: ['task-2'],
      },
    ],
  },
  {
    id: 'proj-2',
    name: 'Onboarding do Cliente Piloto',
    description: 'Preparar materiais e fluxos para o primeiro cliente do SmartProjectAI.',
    owner: 'marcos.ribeiro@smartproject.ai',
    status: 'at_risk',
    updatedAt: formatISO(addDays(now, -1)),
    defaultAssignees: ['Marcos Ribeiro', 'Luiza Faria'],
    tasks: [
      {
        id: 'task-5',
        name: 'Mapear processos atuais',
        assignee: 'Luiza Faria',
        startDate: makeDate(-3),
        endDate: makeDate(0),
        status: 'in_progress',
        dependencies: [],
      },
      {
        id: 'task-6',
        name: 'Configurar ambiente de demo',
        assignee: 'Marcos Ribeiro',
        startDate: makeDate(0),
        endDate: makeDate(3),
        status: 'not_started',
        dependencies: ['task-5'],
      },
      {
        id: 'task-7',
        name: 'Treinamento do time cliente',
        assignee: 'Marcos Ribeiro',
        startDate: makeDate(4),
        endDate: makeDate(7),
        status: 'not_started',
        dependencies: ['task-6'],
      },
    ],
  },
]

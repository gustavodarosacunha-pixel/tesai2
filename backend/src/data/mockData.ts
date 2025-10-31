import { addDays, formatISO } from 'date-fns'
import { Project } from '../types/project'

const baseDate = new Date()

const makeDate = (days: number) => formatISO(addDays(baseDate, days), { representation: 'date' })

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Lancamento do Portal SmartProjectAI',
    description: 'Construcao do portal MVP com dashboard, gestao de tarefas e agente de IA integrado.',
    owner: 'ana.souza@smartproject.ai',
    status: 'on_track',
    updatedAt: formatISO(baseDate),
    defaultAssignees: ['Ana Souza', 'Bruno Nunes', 'Carla Dias', 'Equipe AI'],
    tasks: [
      {
        id: 'task-1',
        name: 'Definir requisitos do MVP',
        assignee: 'Ana Souza',
        startDate: makeDate(-5),
        endDate: makeDate(0),
        status: 'completed',
        dependencies: [],
        description: 'Reunir decisores e delimitar escopo minimo viavel.'
      },
      {
        id: 'task-2',
        name: 'Desenhar arquitetura da solucao',
        assignee: 'Bruno Nunes',
        startDate: makeDate(-2),
        endDate: makeDate(3),
        status: 'in_progress',
        dependencies: ['task-1'],
        description: 'Definir componentes frontend/backend, integracoes e necessidades de dados.'
      },
      {
        id: 'task-3',
        name: 'Implementar dashboard inicial',
        assignee: 'Carla Dias',
        startDate: makeDate(1),
        endDate: makeDate(6),
        status: 'not_started',
        dependencies: ['task-2'],
      },
      {
        id: 'task-4',
        name: 'Prototipar agente de IA',
        assignee: 'Equipe AI',
        startDate: makeDate(2),
        endDate: makeDate(8),
        status: 'not_started',
        dependencies: ['task-2'],
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Onboarding do Cliente Piloto',
    description: 'Preparar material e fluxo de onboarding para o primeiro cliente do SmartProjectAI.',
    owner: 'marcos.ribeiro@smartproject.ai',
    status: 'at_risk',
    updatedAt: formatISO(addDays(baseDate, -1)),
    defaultAssignees: ['Marcos Ribeiro', 'Luiza Faria'],
    tasks: [
      {
        id: 'task-5',
        name: 'Mapear processos atuais do cliente',
        assignee: 'Luiza Faria',
        startDate: makeDate(-3),
        endDate: makeDate(1),
        status: 'in_progress',
        dependencies: [],
      },
      {
        id: 'task-6',
        name: 'Configurar ambiente de demonstracao',
        assignee: 'Marcos Ribeiro',
        startDate: makeDate(0),
        endDate: makeDate(4),
        status: 'not_started',
        dependencies: ['task-5'],
      },
      {
        id: 'task-7',
        name: 'Treinamento para equipe do cliente',
        assignee: 'Marcos Ribeiro',
        startDate: makeDate(5),
        endDate: makeDate(9),
        status: 'not_started',
        dependencies: ['task-6'],
      }
    ]
  }
]

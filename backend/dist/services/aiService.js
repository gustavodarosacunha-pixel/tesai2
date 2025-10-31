"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const node_crypto_1 = require("node:crypto");
const date_fns_1 = require("date-fns");
const projectService_1 = require("./projectService");
const fallbackSuggestions = {
    generate_wbs: [
        'Mapear entregaveis e sub-entregaveis do MVP',
        'Identificar dependencias criticas entre as principais tarefas',
        'Planejar checkpoints de validacao com stakeholders',
    ],
    suggest_next_steps: [
        'Revisar progresso das tarefas criticas desta semana',
        'Atualizar o status dos responsaveis e confirmar disponibilidade',
        'Preparar resumo executivo para sponsors do projeto',
    ],
    update_status: [
        'Consolidar status das tarefas e registrar riscos em aberto',
        'Ajustar datas de conclusao conforme andamento real',
        'Compartilhar resumo atualizado com o time do projeto',
    ],
    custom: [
        'Validar se ha bloqueios logisticos ou dependencias externas',
        'Coletar feedback da equipe sobre a utilizacao do SmartProjectAI',
    ],
};
const buildTaskFromSuggestion = (projectId, name) => {
    const start = (0, date_fns_1.addDays)(new Date(), 1);
    const end = (0, date_fns_1.addDays)(start, 3);
    return {
        id: `${projectId}-task-${(0, node_crypto_1.randomUUID)().slice(0, 6)}`,
        name,
        assignee: 'Equipe IA',
        startDate: (0, date_fns_1.formatISO)(start, { representation: 'date' }),
        endDate: (0, date_fns_1.formatISO)(end, { representation: 'date' }),
        status: 'not_started',
        dependencies: [],
        description: 'Tarefa sugerida automaticamente pelo assistente Gemini.',
    };
};
exports.aiService = {
    async handleAction(request) {
        const project = projectService_1.projectService.getProject(request.projectId);
        if (!project) {
            throw new Error(`Projeto ${request.projectId} nao encontrado`);
        }
        const suggestions = fallbackSuggestions[request.intent] ?? fallbackSuggestions.custom;
        let updatedProject = project;
        let createdTasks;
        if (request.intent === 'generate_wbs') {
            const generated = [
                buildTaskFromSuggestion(project.id, 'Desenhar EAP completa com o assistente'),
                buildTaskFromSuggestion(project.id, 'Priorizar entregaveis criticos do MVP'),
            ];
            generated.forEach((task) => {
                const result = projectService_1.projectService.createTask(project.id, task);
                if (result) {
                    updatedProject = result;
                }
            });
            createdTasks = generated;
        }
        const summary = `Assistente Gemini analisou o projeto '${project.name}' (intent: ${request.intent}).`;
        const responseProject = projectService_1.projectService.upsertProject({ ...updatedProject, updatedAt: new Date().toISOString() });
        return {
            project: responseProject,
            summary,
            suggestions,
            createdTasks,
        };
    },
};
//# sourceMappingURL=aiService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const projectService_1 = require("../services/projectService");
const updateTaskSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(1),
    assignee: zod_1.z.string().min(1),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    status: zod_1.z.enum(['not_started', 'in_progress', 'at_risk', 'blocked', 'completed']),
    dependencies: zod_1.z.array(zod_1.z.string()).default([]),
    description: zod_1.z.string().optional(),
    progress: zod_1.z.number().min(0).max(100).optional(),
});
exports.projectRoutes = (0, express_1.Router)();
exports.projectRoutes.get('/', (_req, res) => {
    return res.json({ projects: projectService_1.projectService.listProjects() });
});
exports.projectRoutes.get('/:projectId', (req, res) => {
    const project = projectService_1.projectService.getProject(req.params.projectId);
    if (!project) {
        return res.status(404).json({ message: 'Projeto nao encontrado' });
    }
    return res.json({ project });
});
exports.projectRoutes.put('/:projectId/tasks/:taskId', (req, res) => {
    const parseResult = updateTaskSchema.safeParse({ ...req.body, id: req.params.taskId });
    if (!parseResult.success) {
        return res.status(400).json({ message: 'Dados invalidos', issues: parseResult.error.issues });
    }
    const project = projectService_1.projectService.updateTask(req.params.projectId, parseResult.data);
    if (!project) {
        return res.status(404).json({ message: 'Projeto nao encontrado' });
    }
    return res.json({ project });
});
//# sourceMappingURL=projectRoutes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const aiService_1 = require("../services/aiService");
const actionSchema = zod_1.z.object({
    projectId: zod_1.z.string(),
    intent: zod_1.z.enum(['generate_wbs', 'suggest_next_steps', 'update_status', 'custom']),
    message: zod_1.z.string().min(3),
});
exports.aiRoutes = (0, express_1.Router)();
exports.aiRoutes.post('/actions', async (req, res) => {
    const parse = actionSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ message: 'Dados invalidos', issues: parse.error.issues });
    }
    try {
        const response = await aiService_1.aiService.handleAction(parse.data);
        return res.json(response);
    }
    catch (error) {
        return res.status(500).json({
            message: error instanceof Error ? error.message : 'Erro ao processar acao do assistente',
        });
    }
});
//# sourceMappingURL=aiRoutes.js.map
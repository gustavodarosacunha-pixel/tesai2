"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const projectRoutes_1 = require("./routes/projectRoutes");
const aiRoutes_1 = require("./routes/aiRoutes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    return res.json({ status: 'ok', service: 'SmartProjectAI API', geminiConfigured: Boolean(env_1.env.geminiApiKey) });
});
app.use('/api/projects', projectRoutes_1.projectRoutes);
app.use('/api/ai', aiRoutes_1.aiRoutes);
app.use((req, res) => {
    return res.status(404).json({ message: `Rota ${req.method} ${req.path} nao encontrada` });
});
app.listen(env_1.env.port, () => {
    console.log(`API SmartProjectAI rodando em http://localhost:${env_1.env.port}`);
});
//# sourceMappingURL=server.js.map
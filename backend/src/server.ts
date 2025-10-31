import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { projectRoutes } from './routes/projectRoutes'
import { aiRoutes } from './routes/aiRoutes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  return res.json({ status: 'ok', service: 'SmartProjectAI API', geminiConfigured: Boolean(env.geminiApiKey) })
})

app.use('/api/projects', projectRoutes)
app.use('/api/ai', aiRoutes)

app.use((req, res) => {
  return res.status(404).json({ message: `Rota ${req.method} ${req.path} nao encontrada` })
})

app.listen(env.port, () => {
  console.log(`API SmartProjectAI rodando em http://localhost:${env.port}`)
})

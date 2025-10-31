# Contexto do projeto
Quero criar um aplicativo web chamado **SmartProjectAI**, inspirado nas principais funcionalidades do **Smartsheet**, mas inicialmente focado apenas em **gerenciamento de projetos**.

O objetivo é desenvolver um MVP com:
- **Interface moderna e responsiva** (React + Tailwind);
- **Banco de dados simples** (Supabase ou SQLite para prototipagem);
- **Agente de IA integrado** (usando API OpenAI) que ajuda o usuário a:
  - Criar novos projetos;
  - Gerar uma EAP (Estrutura Analítica do Projeto) automaticamente;
  - Sugerir próximos passos e tarefas;
  - Preencher campos de cronograma e responsáveis automaticamente;
  - Responder perguntas sobre o andamento do projeto.

# Requisitos do MVP
1. **Autenticação**
   - Login simples com e-mail/senha (pode usar Supabase Auth).

2. **Dashboard de Projetos**
   - Listagem de todos os projetos do usuário;
   - Botão “Criar novo projeto”.

3. **Tela de Projeto**
   - Tabela de tarefas estilo Smartsheet (grid editável com colunas: Nome, Responsável, Início, Fim, Status, Dependências);
   - Opção de visualização em lista e em Gantt (biblioteca sugerida: `react-gantt` ou `dhtmlx-gantt`);
   - Integração com o agente de IA: o usuário pode pedir “Gerar EAP”, “Sugerir próximos passos”, ou “Atualizar status do projeto”.

4. **Agente de IA**
   - Interface de chat lateral (sidebar) integrada ao projeto selecionado;
   - O agente acessa os dados do projeto e pode modificá-los (por exemplo: criar tarefas, alterar status, gerar descrições).

5. **Arquitetura sugerida**
   - **Frontend:** React + TypeScript + Tailwind.
   - **Backend:** Node.js (Express ou Next.js API routes).
   - **Banco de dados:** Supabase (PostgreSQL) ou SQLite (para protótipo local).
   - **IA:** OpenAI API (GPT-4 ou GPT-4o-mini).
   - **Controle de estado:** Zustand ou Redux Toolkit.

# Objetivo do agente do Cursor
Você é um assistente de desenvolvimento experiente.  
Seu papel é ajudar a criar este app passo a passo, sugerindo a melhor estrutura de pastas, geração de componentes, integrações com IA e boas práticas de UX/UI.  
Explique cada passo e gere código funcional, limpo e modular.  
Mantenha o foco na construção de um MVP rápido, mas escalável.

Comece criando:
- Estrutura inicial do projeto (frontend + backend simples);
- Página de dashboard;
- Componente de tabela de tarefas editável;
- Mock de integração com o agente de IA.

## Estrutura de pastas

```
/frontend   # Aplicacao React + Vite + Tailwind
/backend    # API Express em TypeScript com mocks locais
```

## Como executar o projeto

### Pre-requisitos
- Node.js 18+
- npm 9+

### Frontend
```
cd frontend
npm install
npm run dev
```

O Vite esta configurado para proxy das rotas `/api` para `http://localhost:4000` durante o desenvolvimento.

### Backend
```
cd backend
npm install
npm run dev
```

A API expos endpoints mockados em `/api/projects` e `/api/ai/actions`. Ajuste a porta via variavel `PORT` em um arquivo `.env` se necessario.

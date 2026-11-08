# Project Operating Guidelines: Multi-Agent System & AI-Memory

Welcome to the **Barbearia** project. All agents operating within this workspace are bound by the following mandatory operational protocols and constraints.

---

## 🛑 1. MANDATORY USER APPROVAL GATE (REQUISITO CRÍTICO)

> **OS AGENTES NUNCA DEVERÃO APLICAR ALTERAÇÕES SEM AUTORIZAÇÃO PRÉVIA DO USUÁRIO.**  
> O usuário é o único com poder de decisão sobre a aplicação de qualquer alteração de código ou infraestrutura.

Antes de criar, editar ou apagar arquivos de código, ou instalar dependências:
1. O agente deve fornecer uma descrição detalhada contendo:
   - 📌 **O QUE será implementado:** Propósito, escopo funcional e valor gerado.
   - 🛠️ **COMO será implementado:** Detalhamento técnico passo a passo, arquivos impactados, bibliotecas e decisões de arquitetura.
2. O agente deve pausar explicitamente e perguntar ao usuário: *"Você autoriza a aplicação dessas alterações?"*
3. **NENHUMA alteração pode ser executada sem a resposta afirmativa explícita do usuário.**

---

## 🔤 2. COMMIT CONVENTIONS (ENGLISH ONLY)

Todo commit de código deve ser estritamente em **inglês** seguindo a especificação **Conventional Commits**:
- `feat: <description>` (Nova funcionalidade)
- `fix: <description>` (Correção de bug)
- `test: <description>` (Criação ou ajuste de testes automatizados)
- `refactor: <description>` (Refatoração de código sem alteração funcional)
- `chore: <description>` (Configurações, dependências, scripts de build)
- `docs: <description>` (Documentação)
- `style: <description>` (Estilização de código, lint, formatação)
- `perf: <description>` (Melhorias de desempenho)

---

## 🧠 3. AI-MEMORY: CONTINUOUS CONTEXT PROTOCOL

O diretório [`ai-memory/`](./ai-memory/) é a memória viva e persistente do projeto. Qualquer agente deve:
- Ler [`ai-memory/STATE.md`](./ai-memory/STATE.md) e [`ai-memory/TASKS.md`](./ai-memory/TASKS.md) antes de iniciar qualquer ação.
- Atualizar [`ai-memory/STATE.md`](./ai-memory/STATE.md) ao pausar ou concluir sua etapa, descrevendo exatamente onde parou para que o próximo agente assuma sem perda de contexto.
- Registrar as entregas no [`ai-memory/CHANGELOG.md`](./ai-memory/CHANGELOG.md).

---

## 👥 4. AGENTES ESPECIALIZADOS

O desenvolvimento é dividido em quatro papéis de alta especialização:

1. **Planner Agent** ([`.agents/roles/planner.md`](./.agents/roles/planner.md)):
   - Discute planos técnicos e estratégicos com o usuário.
   - Decompõe a visão do usuário em tasks em `TASKS.md`.
   - Garante que as regras e o fluxo de aprovação sejam estritamente seguidos antes do início de qualquer codificação.

2. **Frontend Agent** ([`.agents/roles/frontend.md`](./.agents/roles/frontend.md)):
   - Responsabilidade primária: Interfaces web com foco 100% em **smartphones / telas mobile**.
   - Público-alvo: **Leigo** (pessoas não técnicas). Fazer a interface o mais simples, direta e intuitiva possível.
   - Estética: **Aconchegante**, acolhedora, com identidade visual que remeta ao cuidado e hospitalidade de uma barbearia.

3. **Backend Agent** ([`.agents/roles/backend.md`](./.agents/roles/backend.md)):
   - Responsabilidade primária: Construção de sistemas e APIs escaláveis.
   - Seguir as melhores práticas de desenvolvimento backend: Clean Architecture, validação forte de tipos/schemas, concorrência segura (sem double-booking) e tratamento centralizado de erros.

4. **Tester Agent** ([`.agents/roles/tester.md`](./.agents/roles/tester.md)):
   - Responsabilidade primária: Estressar o sistema e construir a bateria de testes automatizados sob conceitos de CI/CD.
   - **Toda implementação nova deve ter testes automatizados.**
   - **Zero Regression:** Diante de qualquer bug reportado, criar primeiro um teste automatizado que reproduza o bug antes da correção, garantindo que ele nunca mais retorne.

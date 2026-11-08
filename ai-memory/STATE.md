# AI-Memory: Current Project State (Estado Atual)

> **Última Atualização:** 2026-11-08  
> **Status Geral:** REQUISITO DE PERSISTÊNCIA ATUALIZADO (JSON + LIMPEZA 7 DIAS) - AGUARDANDO AUTORIZAÇÃO  
> **Fase Atual:** Fase 1 - Planejamento e Arquitetura da Solução  

---

## 📌 Contexto Atual e Atualização dos Requisitos

O usuário refinou a arquitetura técnica com duas diretrizes cruciais:
1. **Sem Banco de Dados / Sem Prisma:** Toda a persistência de dados será feita puramente em arquivos JSON no diretório `data/` com leitura e escrita atômica.
2. **Limpeza Automática Semanal (7 dias):** O sistema deve reter apenas os agendamentos da semana atual. Todo domingo (ou agendamentos anteriores à semana corrente), os registros passados devem ser automaticamente eliminados.

O **Planner Agent** atualizou a arquitetura em [`ai-memory/ARCHITECTURE.md`](./ARCHITECTURE.md) e o backlog de tarefas em [`ai-memory/TASKS.md`](./TASKS.md).

**Onde Paramos:**
Apresentando o plano ajustado com **O QUE** e **COMO** e aguardando a autorização do usuário para iniciar o setup do projeto.

---

## 🚀 Próximos Passos Imediatos (Após Aprovação)

1. **Setup Next.js & Tailwind:** Criar projeto Next.js (App Router, TypeScript, TailwindCSS) sem banco de dados externo ou Prisma.
2. **Backend Agent (JSON Storage Layer):** Desenvolver módulo `src/lib/storage.ts` com escrita atômica para os arquivos `data/*.json` e algoritmo de limpeza semanal dominical.
3. **Backend Agent (APIs):** Implementar endpoints da fila ao vivo, perfil/cores, calendário/slots e agendamentos.
4. **Tester Agent:** Criar testes unitários para o storage JSON e especialmente para a função de expurgo de agendamentos com mais de 7 dias / semanas anteriores.
5. **Frontend Agent:** Implementar interfaces mobile (cliente e admin) com tema Preto e Dourado.

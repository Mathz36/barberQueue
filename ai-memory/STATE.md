# AI-Memory: Current Project State (Estado Atual)

> **Última Atualização:** 2026-11-08  
> **Status Geral:** NOVOS REQUISITOS RECEBIDOS (UPLOAD DE IMAGEM & HORÁRIOS POR DIA COM ALMOÇO) - AGUARDANDO AUTORIZAÇÃO  
> **Fase Atual:** Fase 3 - Evolução do Painel Administrativo e Regras de Horários  

---

## 📌 Contexto Atual e Novos Requisitos

O usuário solicitou dois ajustes importantes para o painel de administração (`/admin`) e lógica de agendamento:

1. **Upload Direto de Imagem (Substituição de URLs externas):**
   - Permitir que o barbeiro faça upload direto de arquivos de imagem do seu celular/computador (foto de perfil e banner).
   - Política de sobrescrita: uma imagem sobrescreve a anterior para não acumular arquivos desnecessários no disco (`public/uploads/avatar.*` e `public/uploads/banner.*`).
2. **Horários de Atendimento Individuais por Dia da Semana (Segunda a Domingo):**
   - Exibir todos os dias da semana (Segunda a Domingo).
   - Permitir ativar/desativar cada dia individualmente.
   - Configurar horário de abertura e fechamento para cada dia.
   - Configurar **horário de almoço opcional** (início e fim): se preenchido, os slots desse período são omitidos da agenda do cliente; se deixado vazio, não há pausa para almoço.

O **Planner Agent** atualizou o modelo técnico em [`ai-memory/ARCHITECTURE.md`](./ARCHITECTURE.md) e o backlog de tarefas em [`ai-memory/TASKS.md`](./TASKS.md).

**Onde Paramos:**
Apresentando o plano técnico de **O QUE** e **COMO** e aguardando a autorização expressa do usuário antes de aplicar as modificações.

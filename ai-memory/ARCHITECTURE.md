# AI-Memory: Arquitetura Técnica do Sistema

Este documento define a arquitetura, convenções técnicas e padrões de engenharia adotados no projeto.

---

## 🏛️ Princípios Arquiteturais

1. **Mobile-First Real:** O frontend deve ser concebido e otimizado primariamente para navegadores mobile (smartphones), com carregamento ultra-rápido, consumo mínimo de dados e fluidez tátil.
2. **Separação Rígida de Camadas:** Backend desacoplado do frontend (API First), garantindo manutenibilidade e facilidade de testes independentes.
3. **Escalabilidade & Resiliência:**
   - Tratar contenção e concorrência desde a modelagem inicial.
   - Padrão de respostas de erro claras e informativas para a aplicação cliente.
4. **Testabilidade Total (Testability by Design):** Código escrito de forma modular com injeção de dependências e funções puras sempre que possível, facilitando a automação de testes unitários e de integração.

---

## 🧰 Stack Tecnológica Proposta (A ser refinada com a Ideia do Usuário)

- **Frontend:** Framework moderno, reativo e leve (ex: React / Next.js / Vite + React ou Vue), com TailwindCSS para estilização aconchegante e mobile-friendly rápida.
- **Backend:** Node.js (TypeScript) / Python / Go com arquitetura limpa (Clean Architecture / Hexagonal).
- **Banco de Dados:** Relacional (ex: PostgreSQL / SQLite em dev) com integridade referencial estrita para agendamentos.
- **Testes:** Framework de testes rápido e confiável (ex: Vitest / Jest / Pytest / Playwright para testes ponta a ponta e estresse).

---

## 📐 Estrutura de Diretórios Padronizada (Previsão)

```text
barbearia/
├── ai-memory/              # Memória e contexto persistente entre agentes
│   ├── STATE.md
│   ├── TASKS.md
│   ├── ARCHITECTURE.md
│   ├── RULES.md
│   └── CHANGELOG.md
├── .agents/                # Configurações e papéis dos agentes
│   └── roles/
├── AGENTS.md               # Instruções lidas automaticamente pelo Antigravity
├── GEMINI.md               # Diretrizes de projeto
└── (Código do Projeto: src/, tests/, etc. após aprovação do usuário)
```

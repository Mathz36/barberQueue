# AI-Memory: Registro Histórico de Mudanças (CHANGELOG)

Todas as alterações significativas no projeto são registradas aqui em ordem cronológica reversa, acompanhadas da mensagem de commit correspondente (sempre em inglês no git).

---

## [1.2.2] - 2026-11-08

### Segurança e Integridade de Dados
- **Commit:** `fix: isolate test data directory from production storage to prevent resetting profile and appointments`
  - Separação completa do ambiente de testes automatizados (`data-test/` e `uploads-test/`) da base de dados real (`data/` e `uploads/`).
  - Blindagem permanente do perfil real da barbearia (Thiago Barbearia, avatar, banner, bio e agendamentos), garantindo que execuções de testes nunca mais resetem os dados do usuário.

---

## [1.2.1] - 2026-11-08

### Correções (Bugfix com Zero Regression)
- **Commit:** `fix: display appointment target date instead of creation date in admin agenda`
  - Exibição destacada da data real do corte (`10/11/2026`) no admin.
  - Abas de filtro na agenda ("Por Dia" e "Toda a Semana").

---

## [1.2.0] - 2026-11-08

### Entregas
- **Commit:** `feat: add toast notifications and collapsible dropdown sections to admin dashboard`
  - Notificações de feedback ("Configuração Salva" e "Erro: ...").
  - Seções expansíveis tipo dropdown / acordeão.

---

## [1.1.0] - 2026-11-08

### Entregas
- **Commit:** `feat: implement direct image upload with overwrite and weekly schedule with lunch break`

---

## [1.0.0] - 2026-11-08

### Entregas
- **Commit:** `feat: build cozy mobile-first client and admin interfaces with dynamic theme`
- **Commit:** `feat: implement json storage layer with weekly retention and backend rest apis`
- **Commit:** `chore: initialize multi-agent workspace and persistent ai-memory`

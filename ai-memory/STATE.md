# AI-Memory: Current Project State (Estado Atual)

> **Última Atualização:** 2026-11-08  
> **Status Geral:** AJUSTES DE UPLOAD E HORÁRIOS CONCLUÍDOS COM 20/20 TESTES PASSANDO  
> **Fase Atual:** Fase 3 - Conclusão dos Ajustes Solicitados pelo Usuário  

---

## 📌 Contexto Atual e Entregas Recentes

Os dois novos requisitos solicitados foram desenvolvidos, testados e validados:

1. **Upload Direto de Imagem com Sobrescrita Automática:**
   - Endpoint `POST /api/admin/upload` implementado com suporte a `multipart/form-data`.
   - Ao enviar uma nova foto de perfil ou banner, o arquivo anterior do mesmo tipo é automaticamente deletado de `public/uploads/` e substituído pela nova versão, sem acumular arquivos órfãos.
   - Interface do Admin com seletores de arquivo táteis para smartphone e preview imediato.
2. **Horários de Segunda a Domingo & Intervalo de Almoço Opcional:**
   - Modelo de dados atualizado para conter os 7 dias da semana ordenados (Segunda a Domingo).
   - Cada dia possui controle individual de "Aberto/Fechado", "Horário de Abertura", "Horário de Fechamento" e "Horário de Almoço (opcional)".
   - Quando o almoço está preenchido, os slots desse período são omitidos da agenda do cliente. Quando vazio, todos os slots regulares de 1h ficam disponíveis.
   - Botão no painel para limpar o almoço com 1 toque no celular.
3. **Qualidade & CI/CD (Tester Agent):**
   - 20 testes automatizados passando em 6 suítes (cobertura total de regras de agendamento, expurgo semanal, fila, upload e horários).
   - Build de produção compilado com sucesso (`next build`).

---

## 🚀 Como Executar

- **Servidor Dev:** `npm run dev`
- **Página do Cliente:** `http://localhost:3000`
- **Painel do Barbeiro:** `http://localhost:3000/admin` (PIN: `1234`)
- **Suíte de Testes:** `npm test`


## Limpar os Dados Mock do Dashboard

### Contexto

Os contadores no dashboard (processos, tarefas, prazos, alertas) vêm exclusivamente do arquivo `src/data/mock.ts`, que contém dados fictícios escritos diretamente no código. Eles não existem no Supabase.

---

### Duas Opções Disponíveis

**Opção A — Zerar os arrays (dashboard em branco)**
Esvaziar os arrays `mockCases`, `mockTasks`, `mockAlerts` e `mockDeadlines` no arquivo `src/data/mock.ts`, deixando o dashboard zerado e pronto para receber dados reais do Supabase no futuro.

**Opção B — Remover apenas os itens que geram os contadores (recomendada)**
Ajustar os dados mock para que reflitam um estado "limpo":
- Marcar todos os casos como `encerrado` (zerando "processos ativos")
- Marcar todas as tarefas como `concluida` (zerando "tarefas pendentes")
- Marcar todos os prazos com `status: 'cumprido'` (zerando "prazos urgentes")
- Marcar todos os alertas com `treated: true` (zerando "alertas não tratados")

---

### O Que Será Alterado

**Arquivo:** `src/data/mock.ts`

Serão alterados os campos de status nos seguintes arrays:

```text
mockCases     → status: 'encerrado'  (todos os registros)
mockTasks     → status: 'concluida'  (todos os registros)
mockDeadlines → status: 'cumprido'   (todos os registros)
mockAlerts    → treated: true        (todos os registros)
```

---

### Resultado Esperado no Dashboard

| Indicador | Antes | Depois |
|---|---|---|
| Processos Ativos | 5 | 0 |
| Tarefas Pendentes | 7 | 0 |
| Prazos Urgentes | 1 | 0 |
| Alertas Não Tratados | 4 | 0 |

O banner de "próxima audiência" também desaparecerá, pois depende de audiências com status `agendada`.

---

### Observação Importante

Os alertas automáticos que aparecem depois de alguns segundos (simulados no `AlertsContext`) continuarão aparecendo temporariamente, pois são gerados por timers no código. Posso remover esses timers também se desejar.

---

### Impacto

- Sem risco de perda de dados reais (tudo é mock)
- Nenhuma alteração no banco Supabase
- Reversível a qualquer momento

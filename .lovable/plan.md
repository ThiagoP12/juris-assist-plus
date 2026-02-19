
## Limpar Contadores da Agenda

### Problema

A Agenda continua mostrando 8 eventos (1 audiencia, 3 prazos, 4 tarefas) porque a funcao `getEventsForDate` em `src/pages/Agenda.tsx` nao filtra por status. Tarefas com status `concluida` e prazos com status `cumprido` ainda aparecem no calendario.

### Solucao

Adicionar filtros de status na funcao `getEventsForDate` para excluir:
- **Tarefas** com status `concluida`
- **Prazos** com status `cumprido`
- **Audiencias** de processos com status `encerrado`

### Alteracao

**Arquivo:** `src/pages/Agenda.tsx`

Na funcao `getEventsForDate` (linhas 78-143), adicionar verificacoes de status:

1. **Audiencias (linha 91-104):** Adicionar filtro para ignorar audiencias de processos encerrados:
   ```
   if (caso?.status === "encerrado") return;
   ```

2. **Prazos (linha 106-118):** Adicionar filtro para ignorar prazos cumpridos:
   ```
   if (d.status === "cumprido") return;
   ```

3. **Tarefas (linha 120-141):** Adicionar filtro para ignorar tarefas concluidas:
   ```
   if (t.status === "concluida") return;
   ```

### Resultado Esperado

| Indicador Agenda | Antes | Depois |
|---|---|---|
| Total no periodo | 8 | 0 |
| Audiencias | 1 | 0 |
| Prazos | 3 | 0 |
| Tarefas | 4 | 0 |

O calendario ficara limpo, sem eventos exibidos, e a secao "Proximos Eventos" tambem ficara vazia.

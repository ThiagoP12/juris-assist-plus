
## Objetivo

Transformar o botão **"+ Criar"** da sidebar em um fluxo completo inline: ao clicar no dropdown e escolher "Criar Processo" ou "Criar Tarefa", um **Sheet (painel lateral deslizante)** abre com o formulário completo, sem sair da página atual.

## Por que Sheet e não navegação?

O comportamento descrito ("ao clicar aparece os campos") é um padrão de **painel lateral deslizante** (Sheet/Drawer), que mantém o contexto visual da página atual. Isso é mais ergonômico do que redirecionar o usuário. O componente `Sheet` já está disponível na biblioteca de UI (`src/components/ui/sheet.tsx`).

## Arquitetura das Mudanças

Apenas **um arquivo** precisa ser modificado:

- `src/components/layout/AppLayout.tsx`

Os formulários de `NovoProcesso.tsx` e `NovaTarefa.tsx` permanecem como páginas independentes (para quem acessa via URL direta), mas o conteúdo dos formulários será **replicado inline** dentro do Sheet — ou melhor, os próprios componentes de página serão importados e renderizados dentro do Sheet.

### Estratégia de Implementação

Para evitar duplicar código de formulário, a abordagem mais limpa é:

1. Extrair o conteúdo de `NovoProcesso.tsx` e `NovaTarefa.tsx` para componentes reutilizáveis (`NovoProcessoForm` e `NovaTarefaForm`).
2. Usar esses componentes tanto nas páginas (`/processos/novo`, `/tarefas/nova`) quanto dentro do Sheet no `AppLayout`.

Alternativamente (mais simples, sem refatoração das páginas existentes):

- Criar os formulários **diretamente no Sheet** em `AppLayout.tsx`, usando estado local para controlar qual formulário exibir.

Vou usar a **abordagem alternativa mais simples**, criando formulários enxutos dentro do Sheet — com os mesmos campos essenciais — e chamando `navigate()` ou `toast` ao submeter, fechando o Sheet após o sucesso.

## Fluxo de Interação

```text
[+ Criar v] clicado
      |
      v
Dropdown aparece:
  ┌─────────────────┐
  │ 📄 Criar Processo│
  │ ☑ Criar Tarefa  │
  └─────────────────┘
      |
      v (usuário seleciona)
Sheet desliza da direita
      |
      v
Formulário preenchido → "Criar" → Sheet fecha + toast de sucesso
```

## Mudanças Técnicas Detalhadas

### `src/components/layout/AppLayout.tsx`

1. **Importar** `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` de `@/components/ui/sheet`.
2. **Importar** `useNavigate` de `react-router-dom`.
3. **Estado no `CreateButton`**:
   - `sheetOpen: boolean` — controla abertura do Sheet.
   - `sheetType: "processo" | "tarefa" | null` — qual formulário exibir.
4. **Dropdown modificado**: ao clicar em "Criar Processo" ou "Criar Tarefa", seta o tipo e abre o Sheet (não navega mais).
5. **Sheet renderizado abaixo do dropdown** com:
   - `SheetHeader` com título dinâmico ("Novo Processo" / "Nova Tarefa").
   - Formulário inline com os campos essenciais de cada tipo.
   - Botões "Criar" e "Cancelar" (fecha o Sheet).
6. Os formulários **não precisam de `useNavigate`** — ao submeter com sucesso, o Sheet fecha e um `toast` é exibido. A navegação `/processos/novo` e `/tarefas/nova` continua existindo como fallback para quem acessa via URL direta.

### Formulário de Processo (dentro do Sheet):
- Número do Processo (obrigatório)
- Nome do Colaborador (obrigatório)
- Empresa/Filial (Select)
- Tema (Textarea)
- Status (Select)
- Responsável (Select)

### Formulário de Tarefa (dentro do Sheet):
- Processo vinculado (busca com Popover)
- Responsáveis (busca multi-select)
- Descrição (obrigatório)
- Data + Hora
- Prioridade (Select)

## O que NÃO muda

- As páginas `/processos/novo` e `/tarefas/nova` continuam funcionando normalmente via URL.
- Nenhuma lógica de negócio, contextos, ou outros componentes são alterados.
- O visual do botão "Criar" na sidebar permanece idêntico.

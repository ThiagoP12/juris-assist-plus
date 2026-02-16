

# Agenda estilo Google Calendar - Visoes Mes, Semana e Dia

## Problema atual
As abas Mes/Semana/Dia nao fazem nada - so existe a visao de mes. Falta a grade de horarios estilo Google Calendar.

## O que sera feito

Reescrever completamente o componente `src/pages/Agenda.tsx` com 3 visoes funcionais:

### 1. Visao Mes (ja existe, sera mantida)
- Grade de 7 colunas com dias do mes
- Eventos resumidos em cada celula
- Clicar em um dia muda para visao Dia daquele dia

### 2. Visao Semana (novo)
- Grade com 7 colunas (Dom-Sab) e linhas de horario (06:00 ate 22:00)
- Cada hora ocupa uma linha na grade
- Audiencias e tarefas com horario aparecem posicionadas na faixa horaria correta (ex: audiencia as 10:00 aparece na linha das 10h)
- Prazos (sem horario) aparecem como barra no topo do dia ("all-day" area)
- Navegacao prev/next avanca/retrocede 1 semana
- Cabecalho mostra "16-22 Fev 2026"

### 3. Visao Dia (novo)
- Coluna unica com linhas de horario (06:00 ate 22:00)
- Eventos posicionados na faixa horaria correta com altura proporcional (1h padrao)
- Area "dia inteiro" no topo para prazos
- Navegacao prev/next avanca/retrocede 1 dia
- Cabecalho mostra "Segunda, 16 de Fevereiro 2026"

### Navegacao entre visoes
- Estado `selectedDate` (Date) controla o dia/semana/mes visivel
- Ao trocar de aba, a data selecionada se mantem
- Botoes prev/next movem por 1 mes, 1 semana ou 1 dia conforme a visao ativa
- Clicar em um dia na visao Mes muda para visao Dia

### Eventos na grade horaria
- Audiencias: cor primaria (azul/indigo), mostram horario + tipo + nome do funcionario
- Tarefas: cor verde, mostram horario + titulo
- Prazos: cor amarela/warning, aparecem na area "all-day"

## Detalhes Tecnicos

### Arquivo modificado
- `src/pages/Agenda.tsx` - reescrita completa com 3 sub-componentes internos:
  - `MonthView` - grade mensal (refatoracao do existente, adicionando clique no dia)
  - `WeekView` - grade semanal com faixas de horario
  - `DayView` - grade diaria com faixas de horario

### Helpers
- `getWeekDays(date)` - retorna array de 7 datas da semana
- `getEventsForDate(date)` - retorna eventos (audiencias + tarefas + prazos) para uma data
- `HOURS` - array de 06 a 22 para renderizar as linhas de horario

### Sem dependencias novas
- Tudo construido com CSS Grid/Flexbox e Tailwind, sem bibliotecas externas de calendario


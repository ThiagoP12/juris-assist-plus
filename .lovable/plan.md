

## Sugestoes de Melhorias para o SIAG

### Categoria 1: Funcionalidades Novas

**1.1 Dark Mode / Tema Escuro**
O sistema usa Tailwind com variaveis CSS e ja tem `next-themes` instalado, mas nao implementa alternancia de tema. Adicionar um toggle de tema no header/sidebar permitiria uso noturno confortavel.

**1.2 Busca Global (Command Palette)**
Implementar um atalho Ctrl+K / Cmd+K que abre um painel de busca global (usando o `cmdk` que ja esta instalado). Permitiria buscar processos, tarefas, audiencias e navegar rapidamente a qualquer pagina.

**1.3 Exportacao de Relatorios em PDF**
A pagina de Relatorios ja tem graficos ricos (Recharts), mas so exporta CSV em Tarefas. Adicionar exportacao em PDF com os graficos renderizados daria mais valor ao sistema.

**1.4 Notificacoes Push (PWA)**
O projeto ja tem configuracao PWA (`vite-plugin-pwa`, icones `pwa-192x192.png`), mas nao ha service worker ativo para push notifications. Ativar notificacoes push para prazos urgentes e audiencias proximas.

---

### Categoria 2: Melhorias de UX

**2.1 Drag & Drop no Kanban de Processos**
A pagina de Processos ja tem visualizacao Kanban, mas os cards nao podem ser arrastados entre colunas. Adicionar drag-and-drop para alterar status dos processos visualmente.

**2.2 Atalhos de Teclado**
Adicionar atalhos como:
- `N` para novo processo
- `T` para nova tarefa  
- `/` para focar na busca
- `Esc` para fechar modais

**2.3 Skeleton Loading**
Substituir os estados de loading vazios por skeletons animados (o componente `skeleton.tsx` ja existe no projeto mas nao e usado nas paginas principais).

**2.4 Modo Offline**
Aproveitar a infraestrutura PWA para cache de dados e funcionamento offline basico — visualizacao de processos e tarefas mesmo sem conexao.

---

### Categoria 3: Melhorias na Juria (IA)

**3.1 Gerador de Pecas Processuais**
Permitir que a Juria gere rascunhos de pecas (contestacao, recurso, manifestacao) com base nos dados do processo. O usuario pediria "Gere uma contestacao para o processo X" e a Juria produziria um rascunho em Markdown com base nas informacoes do caso.

**3.2 Analise de Risco Automatica**
Ao abrir um processo, a Juria poderia calcular automaticamente um score de risco (baixo/medio/alto) com base em: valor da causa, status, prazos proximos, audiencias pendentes. Exibir como badge no card do processo.

**3.3 Voz para Texto no Chat**
Adicionar um botao de microfone no chat da Juria usando a Web Speech API para ditar perguntas por voz.

---

### Categoria 4: Dados e Integracao

**4.1 Migrar de Mock para Supabase**
Atualmente todo o sistema usa dados em `mock.ts` (array estático). Migrar para tabelas reais no Supabase traria: persistencia real, multi-usuario, e dados que sobrevivem a deploys.

**4.2 Dashboard com Filtros por Periodo**
O dashboard mostra KPIs sem filtro temporal. Adicionar um seletor de periodo (7d, 30d, 3m, YTD) como ja existe em Relatorios, para analisar tendencias.

**4.3 Importacao de Processos via CSV/Excel**
Adicionar funcionalidade de importacao em massa para facilitar a migracao de dados de outros sistemas.

---

### Prioridade Recomendada

| Prioridade | Melhoria | Impacto |
|---|---|---|
| Alta | Busca Global (Cmd+K) | UX — navegacao rapida |
| Alta | Dark Mode | UX — conforto visual |
| Alta | Migrar para Supabase | Infra — dados reais |
| Media | Drag & Drop Kanban | UX — gestao visual |
| Media | Gerador de Pecas (IA) | Produtividade |
| Media | Analise de Risco (IA) | Inteligencia |
| Baixa | Notificacoes Push | Engajamento |
| Baixa | Modo Offline | Disponibilidade |


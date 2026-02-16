

# Empresas Revalle e Funcionarios por Unidade

## O que sera feito

1. **Criar estrutura de empresas Revalle** no mock data com as 7 unidades:
   - Revalle Juazeiro
   - Revalle Bonfim
   - Revalle Petrolina
   - Revalle Ribeira do Pombal
   - Revalle Paulo Afonso
   - Revalle Alagoinhas
   - Revalle Serrinha

2. **Criar lista de funcionarios** vinculados a cada unidade (dados de exemplo com 2-3 funcionarios por unidade)

3. **Adicionar filtro por empresa** na tela de Processos para filtrar por unidade Revalle

4. **Atualizar formulario "Novo Processo"** - ao selecionar a empresa, o campo de funcionario mostra apenas os colaboradores daquela unidade

5. **Atualizar processos de exemplo** para usar as empresas Revalle reais

## Detalhes Tecnicos

### Arquivos modificados

- **`src/data/mock.ts`**:
  - Adicionar array `mockCompanies` com as 7 unidades Revalle (id, nome)
  - Adicionar array `mockEmployees` com funcionarios vinculados por `company_id`
  - Atualizar `mockCases` para usar nomes das unidades Revalle
  - Atualizar interface `Case` para usar `company_id` alem do campo `company` (string)

- **`src/pages/Processos.tsx`**:
  - Adicionar Select de filtro por empresa (dropdown com as 7 unidades)
  - Incluir busca por nome da empresa no filtro de texto
  - Exibir nome da empresa com destaque no card do processo

- **`src/pages/ProcessoDetalhe.tsx`**:
  - Exibir empresa corretamente nos dados do processo

- **Novo arquivo `src/pages/NovoProcesso.tsx`**:
  - Formulario de criacao de processo com:
    - Select de Empresa (7 unidades Revalle)
    - Select de Funcionario (filtrado pela empresa selecionada)
    - Demais campos: numero do processo, tema, tribunal, responsavel, advogado, sigilo
  - Rota `/processos/novo`

- **`src/App.tsx`**:
  - Adicionar rota para `/processos/novo`

### Dados de exemplo

Cada unidade tera 2-3 funcionarios de exemplo, totalizando cerca de 15 colaboradores. Os 5 processos existentes serao atualizados para referenciar unidades Revalle e seus respectivos funcionarios.




## Upload de Foto de Perfil para Usuarios

### O que sera feito
Permitir que cada usuario faca upload de uma foto de perfil que substituira o avatar de iniciais coloridas. A foto sera armazenada no Supabase Storage e a URL salva no `localStorage` (ja que o sistema ainda usa dados mockados).

### Como vai funcionar
1. Clicar no avatar (no sidebar ou na pagina de usuarios) abre um seletor de arquivo
2. A imagem e enviada para um bucket `avatars` no Supabase Storage
3. A URL publica e salva no `localStorage` com chave por usuario
4. O componente `UserAvatar` passa a exibir a foto quando disponivel, mantendo as iniciais como fallback

### Etapas

**1. Criar bucket `avatars` no Supabase Storage**
- Migration SQL para criar bucket publico `avatars`
- Politica RLS permitindo upload e leitura anonima (sistema ainda nao tem auth real)

**2. Atualizar `UserAvatar` para suportar foto**
- Adicionar prop opcional `avatarUrl?: string`
- Se `avatarUrl` existir, renderizar `<img>` com fallback para iniciais em caso de erro
- Manter toda a logica atual de cores/iniciais como fallback

**3. Criar hook `useUserAvatar`**
- Gerencia upload da imagem para o Supabase Storage
- Salva a URL no `localStorage` com chave `siag_avatar_{userId}`
- Retorna `avatarUrl`, `uploadAvatar(file)`, `isUploading`

**4. Adicionar interacao de upload no sidebar (AppLayout)**
- Avatar do usuario logado fica clicavel
- Ao clicar, abre `<input type="file" accept="image/*">`
- Apos selecionar, faz upload e atualiza a foto

**5. Adicionar upload na pagina Usuarios e Permissoes**
- Botao de camera/editar sobre o avatar de cada usuario
- Mesma logica de upload

---

### Detalhes Tecnicos

**Arquivos criados:**
- `src/hooks/useUserAvatar.ts` — hook de upload + persistencia

**Arquivos modificados:**
- Migration SQL — bucket `avatars` + RLS
- `src/components/ui/user-avatar.tsx` — prop `avatarUrl`, renderizar `<img>` com fallback
- `src/components/layout/AppLayout.tsx` — avatar clicavel no sidebar
- `src/pages/UsuariosPermissoes.tsx` — botao de upload no card do usuario

**Dependencias:** Nenhuma nova (usa Supabase Storage SDK ja disponivel)


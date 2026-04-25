### Sistema de Evolução Pessoal

Sistema de evolução pessoal gamificado construído com React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **Frontend**: Vite, React, TypeScript
- **Estilização**: Tailwind CSS, shadcn-ui
- **Backend/Banco de Dados**: Supabase
- **Gerenciamento de Estado**: TanStack Query (React Query)
- **Formulários**: React Hook Form, Zod

## 🛠️ Começando

Siga estas instruções para configurar o projeto localmente.

### Pré-requisitos

- Node.js (versão recomendada no `.node-version`)
- npm

### Instalação

1. Clone o repositório
2. Instale as dependências:

   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` baseado no `.env.example`
   - Adicione suas credenciais do Supabase (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)

### Execução

Para iniciar o servidor de desenvolvimento:

```sh
npm run dev
```

O projeto estará disponível em `http://localhost:8080`.

## 📦 Estrutura do Projeto

- `src/components`: Componentes reutilizáveis da interface
- `src/pages`: Páginas da aplicação
- `src/hooks`: Hooks customizados e consultas ao banco de dados
- `src/integrations`: Configurações de integrações externas (Supabase)
- `supabase/migrations`: Scripts SQL para o banco de dados

## 📄 Licença

Este projeto é privado.

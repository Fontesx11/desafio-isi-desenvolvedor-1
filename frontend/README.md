# Frontend

Interface da liga em React 19 com TypeScript, criada com Vite. Consome a API do `backend/`.

- **URL do frontend:** `http://localhost:5173`
- **API usada:** `http://localhost:3000/api/v1` (variável `VITE_API_URL`)

## Como instalar e executar

O frontend não sobe sozinho: ele sobe junto com o banco e a API pelo `docker compose up`, na raiz do repositório. Os passos estão no [`README.md`](../README.md#como-instalar-e-executar-ubuntu-2404) da raiz. A interface abre em `http://localhost:5173`.

## Pré-requisitos dos comandos de qualidade

| Ferramenta        | Versão                             | Observação                                                             |
| ----------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| Node.js (com npm) | 22.18 ou superior, na linha 22 LTS | Só para rodar os comandos abaixo fora do container, depois do `npm ci` |

## Variáveis de ambiente

| Variável       | Valor do exemplo               | Para que serve                           |
| -------------- | ------------------------------ | ---------------------------------------- |
| `VITE_API_URL` | `http://localhost:3000/api/v1` | Endereço da API, com o prefixo `/api/v1` |

## Comandos de qualidade

| Comando                | O que faz                                                                   |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm test`             | Roda os testes uma vez (Vitest com Testing Library, sem modo de observação) |
| `npm run lint`         | Lint com o oxlint                                                           |
| `npm run format:check` | Confere a formatação com o Prettier, sem alterar arquivos                   |
| `npm run build`        | Confere os tipos (`tsc -b`) e gera a versão de produção                     |

## Telas

| Rota            | Tela                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/`             | Tela inicial                                                                                                                      |
| `/players`      | Jogadores: tabela paginada, busca, filtros, ordenação, cadastro, edição, condição, exclusão e compra                              |
| `/clubs`        | Clubes: listagem ordenável e criação                                                                                              |
| `/clubs/{id}`   | Página do clube: caixa, valor do elenco, patrimônio e as abas Elenco (com a venda), Escalação e Histórico (com os totais e o CSV) |
| `/matches`      | Partidas: nova partida e histórico com filtro por clube                                                                           |
| `/matches/{id}` | Partida: placar e os 6 duelos                                                                                                     |
| `/standings`    | Classificação                                                                                                                     |

## Estrutura de pastas

```text
frontend/src/
├── index.tsx              # QueryClient do TanStack Query e a aplicação
├── router.tsx             # Router do TanStack Router
├── routes/                # Rotas por arquivo; cada uma só aponta para a página do módulo
├── layout/                # Menu lateral, cabeçalho e título de página
├── components/            # Componentes compartilhados: tabela, campo de formulário, estados de lista, filtros, paginação
│   └── ui/                # Componentes do shadcn/ui
├── hooks/                 # Hooks genéricos (debounce)
├── lib/                   # Formatação de moeda e data (horário de Brasília) e download de arquivo
├── shared/api/            # Instância do Axios e leitura do `message` dos erros da API
└── modules/               # Um módulo por assunto: jogadores, clubes, mercado, liga, partidas, classificacao e home
```

Cada módulo segue a mesma divisão: `pages/` (telas), `components/`, `hooks/` (`use<Modulo>Queries`, com as consultas e as mutações), `services/` (chamadas à API), `types/`, `schemas/` (validação com Zod), `constants/` e `utils/`. Nenhum componente chama a API direto: as chamadas ficam nos `services/` e chegam às telas pelos hooks.

## Bibliotecas

Stack obrigatória: React, React DOM, TypeScript e Vite (com `@vitejs/plugin-react`).

| Biblioteca                                                                      | Motivo                                                                                                                        |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `@tanstack/react-query`                                                         | Cache das respostas da API, estados de carregamento e erro, e atualização das telas depois de cada ação (`invalidateQueries`) |
| `@tanstack/react-router` e `@tanstack/router-plugin` (dev)                      | Rotas por arquivo, com tipos nos parâmetros (`/clubs/{id}`, `/matches/{id}`)                                                  |
| `axios`                                                                         | Chamadas HTTP, com um interceptor que transforma o `message` da API no erro mostrado na tela                                  |
| `react-hook-form` e `@hookform/resolvers`                                       | Estado dos formulários e envio                                                                                                |
| `zod`                                                                           | Validação dos campos antes de enviar (obrigatórios e limites), com a mensagem junto ao campo                                  |
| `tailwindcss` e `@tailwindcss/vite`                                             | Estilo                                                                                                                        |
| `shadcn`, `radix-ui`, `class-variance-authority` e `tw-animate-css`             | Componentes de interface (diálogos, menus, abas, seletores) acessíveis, copiados para `components/ui/`                        |
| `cn`                                                                            | Junta classes do Tailwind sem conflito                                                                                        |
| `lucide-react`                                                                  | Ícones                                                                                                                        |
| `sonner`                                                                        | Avisos de sucesso e de erro (toasts)                                                                                          |
| `@fontsource-variable/geist`                                                    | Fonte do mockup, sem depender de serviço externo                                                                              |
| `vitest`, `@testing-library/react`, `@testing-library/jest-dom` e `jsdom` (dev) | Testes de componente                                                                                                          |
| `oxlint` (dev)                                                                  | Lint                                                                                                                          |
| `prettier` (dev)                                                                | Formatação                                                                                                                    |
| `typescript`, `@types/react`, `@types/react-dom` e `@types/node` (dev)          | Tipos                                                                                                                         |

## Decisões e premissas

- **Só desktop:** as telas foram pensadas para 1366 × 768 (a janela da banca) e 1440 × 900 (o mockup). Não há layout de 375 px.
- **Abas de jogadores:** "Livres" manda `free=true` e "Em clubes" manda `free=false` para a API. Os números das 3 abas vêm do `meta.total_items` da API.
- **Recusas que a tela impede** (as que o enunciado permite):
  - "Livres" junto com o filtro por clube;
  - de `DOENTE` direto para `APTO`;
  - mudança de posição de jogador com clube;
  - idade menor que a atual;
  - as escolhas da escalação (setor da vaga, jogador já escolhido e `DOENTE`);
  - o mesmo clube como mandante e visitante.
  - Todas as outras recusas são enviadas à API, e a tela mostra o `message` devolvido.
- **Busca por nome:** só é enviada com 2 caracteres ou mais, o mínimo que a API aceita, e espera o usuário parar de digitar.
- **Trilha do cabeçalho na página do clube:** fixa ("Clubes"); o nome do clube fica no título da página.

## Funcionalidades não implementadas e uso de inteligência artificial

Estão no [`README.md`](../README.md#funcionalidades-não-implementadas) da raiz.

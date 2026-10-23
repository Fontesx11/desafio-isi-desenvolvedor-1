# Passe: mercado de jogadores da liga

Estudo de caso SENAI/PE – CÓD. 237 Desenvolvedor I (Fullstack). Aplicação web para administrar uma liga de futebol fictícia: jogadores, clubes, compra e venda com contrato de fidelidade, histórico de transações, escalação, partidas e classificação.

| Parte | Tecnologia | Detalhes |
| --- | --- | --- |
| Backend | NestJS 12 com TypeScript, TypeORM e PostgreSQL 18 | [`backend/README.md`](backend/README.md) |
| Frontend | React 19 com TypeScript, criado com Vite | [`frontend/README.md`](frontend/README.md) |

- **Origem da API:** `http://localhost:3000` (as rotas ficam em `/api/v1`)
- **URL do frontend:** `http://localhost:5173`
- **Documentação interativa da API (Swagger):** `http://localhost:3000/docs`

## Pré-requisitos

| Ferramenta | Versão | Observação |
| --- | --- | --- |
| Docker Engine com Docker Compose v2 | testado com Docker 28.1 e Compose 2.35 | Sobe o banco, a API e o frontend |
| Node.js (com npm) | 22.18 ou superior, na linha 22 LTS | Só para a recriação do banco e os comandos de qualidade, fora dos containers |
| PostgreSQL | 18 | Imagem pública `postgres:18-alpine`, iniciada pelo `docker-compose.yaml`. Não precisa instalar |

## Como instalar e executar (Ubuntu 24.04)

A partir da raiz do repositório:

```bash
cp backend/.env.example backend/.env
docker compose up --build
# API em http://localhost:3000 (o script da banca acrescenta /api/v1)
# Interface em http://localhost:5173
```

- O comando fica em execução e sobe três containers: o PostgreSQL (`fontes-desafio-db`, na porta `5432`), a API (`fontes-desafio-api`) e o frontend (`fontes-desafio-web`).
- Na primeira vez, cada container instala as próprias dependências pelos arquivos de trava versionados (`backend/package-lock.json` e `frontend/package-lock.json`), o que leva alguns minutos.

## Como criar e recriar o banco do zero

- **Criação:** acontece no `docker compose up`. Antes de subir, a API roda `npm run migration:run` (`backend/.docker/entrypoint.sh`), que espera o banco, cria o banco `desafio` e aplica as migrations de `backend/db/migrations/`. O banco começa vazio: sem jogadores, clubes, transações nem partidas.
- **Recriação:** com os containers no ar, em outro terminal, a partir da raiz do repositório:

```bash
cd backend
npm run db:reset
```

O `db:reset` apaga o banco com `DROP DATABASE desafio WITH (FORCE)`, que derruba as conexões abertas. Depois reinicia a API, que cria o banco de novo e aplica as migrations.

## Variáveis de ambiente

Cada parte tem o seu `.env.example`, com valores que funcionam sem alteração:

| Arquivo | Variáveis | Detalhes |
| --- | --- | --- |
| `backend/.env.example` | `PORT`, `CORS_ORIGIN`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DATABASE_URL` | [`backend/README.md`](backend/README.md#variáveis-de-ambiente) |
| `frontend/.env.example` | `VITE_API_URL` | [`frontend/README.md`](frontend/README.md#variáveis-de-ambiente) |

## Comandos de qualidade

Rodam fora dos containers, na pasta de cada parte, depois do `npm ci`, e terminam sozinhos, sem modo de observação. No backend, a partir da raiz do repositório:

```bash
cd backend
npm ci
npm test
npm run lint
npm run format:check
```

No frontend, a partir da raiz do repositório:

```bash
cd frontend
npm ci
npm test
npm run lint
npm run format:check
```

| Comando | Backend | Frontend |
| --- | --- | --- |
| `npm test` | Testes unitários (Vitest): cálculos do jogador, cadastro e listagem, clubes, mercado, partidas e datas | Teste de componente (Vitest e Testing Library) |
| `npm run lint` | oxlint, com as regras que usam os tipos | oxlint |
| `npm run format:check` | Prettier, só verifica | Prettier, só verifica |

## Estrutura de pastas

```text
.
├── backend/              # API REST (NestJS): estrutura detalhada no backend/README.md
├── frontend/             # Interface (React + Vite): estrutura detalhada no frontend/README.md
└── docker-compose.yaml   # PostgreSQL, API e frontend
```

## Bibliotecas

A lista de cada parte, com o motivo de cada biblioteca, está em [`backend/README.md`](backend/README.md#bibliotecas) e em [`frontend/README.md`](frontend/README.md#bibliotecas).

## Decisões e premissas

As decisões que tomei onde precisei interpretar o enunciado estão em [`backend/README.md`](backend/README.md#decisões-e-premissas) e em [`frontend/README.md`](frontend/README.md#decisões-e-premissas). As que valem para o projeto todo:

- **Mensagens de erro em português:** o `message` de cada recusa da API é exibido como está pela interface.
- **Interface só para desktop:** pensada para a janela da banca (1366 × 768) e para o mockup (1440 × 900), sem layout de 375 px.

## Funcionalidades não implementadas

Nenhuma das funcionalidades obrigatórias ficou de fora.

Diferenciais não feitos: responsividade em 375 px (frontend) e registro de logs de cada requisição (backend).

## Uso de inteligência artificial

- **Ferramenta:** Claude Code (Anthropic), no terminal.

**Backend**

- **Onde e como:** escrevi o código e usei a IA como assistente ao longo do desenvolvimento, para:
  - ler o enunciado e o barema e transformar as regras em lista de tarefas;
  - explicar cada regra de negócio com exemplos e casos-limite antes de eu implementar;
  - revisar o meu código e sugerir ajustes;
  - implementar trechos pontuais a meu pedido, uma parte por vez, nos services;
  - escrever os testes unitários e a documentação do Swagger, que revisei.
- **Por quê:** o enunciado é longo e tem muitas regras com casos-limite (arredondamentos, faixas, datas). A IA acelerou a leitura e a conferência dos números com os exemplos do enunciado.
- **Controle:** cada parte foi lida, testada pela API e commitada por mim.
- **O que aceitei, alterei ou descartei:**
  - descartei a primeira versão da listagem de jogadores, um filtro global de erros e os testes dele;
  - alterei as sugestões para manter um padrão único no projeto: tipos em `interfaces/`, constantes em `constants/`, resposta montada no controller e relações do ORM só no lado N:1;
  - descartei abstrações usadas uma só vez e recursos de biblioteca desnecessários (como o `$constraint` do class-validator);
  - aceitei as transações do banco na compra, na venda, na escalação e na partida, e os cálculos em centavos, depois de conferir os números com os exemplos do enunciado.

**Frontend**

- **Telas (feitas pela IA):** a marcação JSX e o estilo (Tailwind CSS e componentes do shadcn/ui) foram gerados pela IA a partir do mockup do Figma; fiz ajustes pontuais.
- **Minha parte:** a camada de dados e a organização do React:
  - services com Axios;
  - hooks com TanStack Query: chaves, invalidação depois de cada ação e tratamento de erro;
  - revisão da reutilização de componentes e das boas práticas do React, também com ajuda da IA.
- **Por quê:** passar o mockup para JSX e Tailwind é um trabalho longo e repetitivo. Com a IA nas telas, o meu tempo foi para a ligação com a API e para as regras que a interface precisa respeitar. Mesmo assim, acompanhei a criação de cada tela, lendo o código gerado e testando na interface.
- **O que aceitei, alterei ou descartei:**
  - descartei abstrações que a IA propôs e que eram usadas num lugar só (hook só para o total de jogadores, badge de contador, Context global para os contadores do menu);
  - descartei o filtro "Em clubes" feito na tela, que quebrava a paginação: a aba manda `free=false` para a API;
  - mantive props explícitas e `onSuccess`/`onError` escritos em cada mutação, mais fáceis de ler.

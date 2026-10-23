# Backend

API REST do mercado de jogadores da liga, em NestJS com TypeScript e PostgreSQL.

- **Origem da API:** `http://localhost:3000` (as rotas ficam em `/api/v1`)
- **Origem do frontend liberada no CORS:** `http://localhost:5173`
- **Documentação interativa da API (Swagger):** `http://localhost:3000/docs`

## Pré-requisitos

| Ferramenta | Versão | Observação |
| --- | --- | --- |
| Docker Engine com Docker Compose v2 | testado com Docker 28.1 e Compose 2.35 | Sobe o banco, a API e o frontend pelo `docker-compose.yaml` da raiz |
| Node.js (com npm) | 22.18 ou superior, na linha 22 LTS | Só para a recriação do banco e os comandos de qualidade, fora dos containers |
| PostgreSQL | 18 | Imagem pública `postgres:18-alpine`, iniciada pelo `docker-compose.yaml` da raiz. Não precisa instalar |

O dbmate, usado nas migrations, é instalado pelo npm como dependência de desenvolvimento.

## Como instalar e executar

O backend não sobe sozinho: ele sobe junto com o banco e o frontend pelo `docker compose up`, na raiz do repositório. Os passos estão no [`README.md`](../README.md#como-instalar-e-executar-ubuntu-2404) da raiz.

- Antes de subir a API, o container roda `npm run migration:run` (`.docker/entrypoint.sh`), que espera o banco aceitar conexões, cria o banco `desafio` se ele não existir e aplica as migrations de `db/migrations/`. O banco começa vazio.
- Quando a API sobe, o log do container mostra a URL da API e a do Swagger.

Para conferir: `curl http://localhost:3000/api/v1/players` responde `200` com `{"data":[],"meta":{...}}`.

## Como recriar o banco do zero

Com os containers no ar, a partir da raiz do repositório:

```bash
cd backend
npm run db:reset
```

O `db:reset` apaga o banco com `DROP DATABASE desafio WITH (FORCE)`, que derruba as conexões abertas. Depois reinicia a API, que cria o banco de novo, vazio, e aplica as migrations.

## Variáveis de ambiente

Todas estão em `.env.example`. Os valores do exemplo funcionam sem alteração. No `docker compose up`, o compose substitui `DB_HOST` (`desafio-db`), `DB_PORT` (`5432`) e `DATABASE_URL` pelos valores da rede interna dos containers; as outras vêm do `.env`.

| Variável | Valor do exemplo | Para que serve |
| --- | --- | --- |
| `PORT` | `3000` | Porta da API |
| `CORS_ORIGIN` | `http://localhost:5173` | Única origem liberada no CORS (a URL do frontend) |
| `DB_HOST` | `localhost` | Host do PostgreSQL |
| `DB_PORT` | `5432` | Porta do PostgreSQL publicada pelo Docker Compose |
| `DB_USER` | `postgres` | Usuário do banco |
| `DB_PASSWORD` | `postgres` | Senha do banco (só do ambiente local) |
| `DB_NAME` | `desafio` | Nome do banco |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/desafio?sslmode=disable` | Conexão usada pelo dbmate nas migrations |

## Comandos de qualidade

Rodam fora dos containers, na pasta `backend/`, depois do `npm ci`:

```bash
cd backend
npm ci
npm test
npm run lint
npm run format:check
```

| Comando | O que faz |
| --- | --- |
| `npm test` | Roda os testes unitários uma vez (Vitest, sem modo de observação) |
| `npm run lint` | Lint com o oxlint, com as regras que usam os tipos do TypeScript |
| `npm run format:check` | Confere a formatação com o Prettier, sem alterar arquivos |

Os testes cobrem os cálculos do jogador (valor de mercado, overall e valor base), o cadastro e a listagem de jogadores, os clubes, o mercado, as partidas e as datas no horário de Brasília. Não precisam do banco.

## Diferenciais implementados

| Diferencial | Como executar |
| --- | --- |
| Testes automatizados | `npm test`, na pasta `backend/` (seção [Comandos de qualidade](#comandos-de-qualidade)). Termina sozinho, sem modo de observação. O valor de mercado (RN02 a RN05) é conferido em `src/modules/jogadores/utils/players.calculations.spec.ts` |
| Docker e Docker Compose | `docker compose up --build`, na raiz do repositório, sobe o banco, a API e o frontend ([`README.md`](../README.md#como-instalar-e-executar-ubuntu-2404) da raiz) |
| Documentação interativa da API (Swagger) | Com a aplicação no ar, abrir `http://localhost:3000/docs`. Traz todos os endpoints da tabela abaixo |
| Lint e formatação | `npm run lint` (oxlint) e `npm run format:check` (Prettier, só verifica), na pasta `backend/` (seção [Comandos de qualidade](#comandos-de-qualidade)) |

O registro de logs de cada requisição não foi implementado.

## Endpoints implementados

| Método | Rota |
| --- | --- |
| `POST` | `/api/v1/players` |
| `GET` | `/api/v1/players` |
| `GET` | `/api/v1/players/{id}` |
| `PUT` | `/api/v1/players/{id}` |
| `PATCH` | `/api/v1/players/{id}/condition` |
| `DELETE` | `/api/v1/players/{id}` |
| `POST` | `/api/v1/clubs` |
| `GET` | `/api/v1/clubs` |
| `GET` | `/api/v1/clubs/{id}` |
| `POST` | `/api/v1/players/{id}/buy` |
| `POST` | `/api/v1/players/{id}/sell` |
| `GET` | `/api/v1/clubs/{id}/transactions` |
| `GET` | `/api/v1/clubs/{id}/transactions/export` |
| `PUT` | `/api/v1/clubs/{id}/lineup` |
| `GET` | `/api/v1/clubs/{id}/lineup` |
| `POST` | `/api/v1/matches` |
| `GET` | `/api/v1/matches` |
| `GET` | `/api/v1/matches/{id}` |
| `GET` | `/api/v1/standings` |

## Estrutura de pastas

```text
backend/
├── db/migrations/          # Migrations em SQL (dbmate), uma por tabela, na ordem das chaves estrangeiras
├── src/
│   ├── main.ts             # Sobe a aplicação: CORS, Swagger, porta e banner
│   ├── app.module.ts       # Módulo raiz: configuração, TypeORM e módulos de domínio
│   ├── app.setup.ts        # Prefixo /api/v1 e ValidationPipe global
│   ├── app.swagger.ts      # Documentação interativa em /docs
│   ├── app.banner.ts       # Banner com a URL da API e a do Swagger, ao subir
│   ├── core/               # Código compartilhado entre os módulos
│   │   ├── decorators/     # @IdParam: id da URL validado (fora do formato → 404)
│   │   ├── dtos/           # Paginação comum (page, limit)
│   │   ├── transformers/   # Normalização de espaços e conversão de inteiros
│   │   ├── utils/          # Funções puras: CSV, datas, arredondamento, paginação, textos
│   │   └── validators/     # Regras entre campos, data no formato de Brasília e fábrica do erro 400
│   ├── infrastructure/     # Configuração do TypeORM lida das variáveis de ambiente
│   └── modules/
│       ├── jogadores/      # CRUD, listagem e cálculos do jogador
│       ├── clubes/         # Cadastro, listagem e consulta do clube
│       ├── contratos/      # Contrato de fidelidade (sem rotas próprias)
│       ├── transacoes/     # Transações de compra e venda (sem rotas próprias)
│       ├── mercado/        # Compra, venda, histórico e exportação CSV
│       ├── escalacoes/     # Titulares de cada clube (sem rotas próprias)
│       ├── liga/           # Escalação: PUT e GET /clubs/{id}/lineup
│       └── partidas/       # Partidas, duelos e classificação
└── test/mocks/             # Dados de teste compartilhados entre os arquivos .spec.ts
```

Cada módulo segue a mesma divisão: `*.controller.ts` (rotas e montagem da resposta), `*.service.ts` (regras e acesso ao banco), `dtos/` (entrada validada e formato de saída), `entities/` (mapeamento das tabelas), `enums/`, `interfaces/` (tipos internos), `utils/` (funções puras) e `constants/`.

O `mercado/` orquestra a compra e a venda: usa os services de jogadores, clubes, contratos, transações e escalações, mas nenhum deles o importa. O `liga/` faz o mesmo com a escalação, e o `escalacoes/` não depende de nenhum módulo, porque é usado pela venda e pela mudança para `DOENTE`. Assim, não há dependência circular entre os módulos.

## Bibliotecas

Stack obrigatória: Node.js, TypeScript e NestJS (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, com `reflect-metadata` e `rxjs`, que o NestJS exige).

| Biblioteca | Motivo |
| --- | --- |
| `@nestjs/config` | Lê o `.env` (porta, CORS e banco) sem escrever segredos no código |
| `typeorm` e `@nestjs/typeorm` | ORM: repositórios, consultas parametrizadas, exclusão lógica (`@DeleteDateColumn`) e transações do banco (`dataSource.transaction`) na compra, na venda, na escalação e na partida |
| `pg` | Driver do PostgreSQL usado pelo TypeORM |
| `class-validator` e `class-transformer` | Validação declarativa dos DTOs pelo `ValidationPipe` e conversão dos query params |
| `@nestjs/swagger` | Documentação interativa da API em `/docs`, gerada a partir dos controllers e dos DTOs |
| `dbmate` (dev) | Migrations em SQL puro, versionadas em `db/migrations/`. Cria o banco se ele não existir. É instalado pelo npm, sem nada no sistema |
| `@nestjs/cli` e `@nestjs/schematics` (dev) | Compilação e execução (`nest start --watch`) |
| `typescript` (dev) | Compilador |
| `vitest` (dev) | Testes unitários |
| `@vitest/coverage-v8` (dev) | Relatório de cobertura (`npm run test:cov`) |
| `vite-tsconfig-paths` (dev) | Faz o Vitest resolver os caminhos do `tsconfig.json` |
| `@nestjs/testing` (dev) | Monta o módulo do Nest com dependências simuladas nos testes de controller e service |
| `oxlint` e `oxlint-tsgolint` (dev) | Lint rápido, com regras que usam os tipos (`--type-aware`), como promessas sem `await` |
| `prettier` (dev) | Formatação |
| `@types/express` e `@types/node` (dev) | Tipos do Express e do Node.js |

## Decisões e premissas

Pontos em que precisei interpretar o enunciado ou escolher um caminho, e o que decidi. As decisões que valem para o projeto todo (como as mensagens de erro em português) estão no [`README.md`](../README.md#decisões-e-premissas) da raiz.

**Validação e erros**
- Numa recusa de validação, o `message` traz só a primeira mensagem do primeiro campo com erro, em texto (o `ValidationPipe` do Nest devolveria uma lista).
- Quando um pedido tem mais de um problema, a ordem de conferência é: formato do corpo e dos parâmetros (400), depois existência (404), depois regra de negócio (409). Na compra, o prazo da fidelidade (data futura e até 1.095 dias, 400) é conferido depois das regras do clube e da recompra. Na escalação, os ids são conferidos na ordem enviada, e o primeiro com problema decide entre 404 e 409.

**Jogadores**
- Editar um jogador com clube reenviando a **mesma** posição é aceito; só a troca de posição responde 409.
- No `PUT`, a regra "35 anos ou mais → agilidade até 85" usa a idade enviada no corpo.
- Um jogador `DOENTE` pode ser comprado e vendido, porque nenhuma regra impede.
- A listagem (`GET /players`) carrega os jogadores ativos e calcula o valor de mercado, filtra, ordena e pagina na aplicação. O motivo:
  - O valor de mercado não pode ser coluna (seção do banco no enunciado), então não há valor gravado para filtrar ou ordenar com um `WHERE` ou `ORDER BY` simples.
  - A alternativa no banco seria repetir a fórmula em SQL, numa view ou na própria consulta. Foi descartada para a regra não ficar em dois lugares (TypeScript e SQL), que precisariam mudar juntos. A fórmula fica só em `src/modules/jogadores/utils/players.calculations.ts`.
  - A ordem alfabética do enunciado (minúsculas, sem acentos, comparação pela ordem Unicode) não é a ordenação padrão do PostgreSQL e também teria de ser reproduzida em SQL.
  - Com o volume do desafio, carregar os jogadores ativos é barato. Se crescesse, os filtros por colunas gravadas (posição, condição, idade e clube) passariam para o `WHERE`, e só o que depende do valor de mercado ficaria na aplicação.

**Clubes**
- A unicidade do nome usa um índice único em `lower(nome)`: ignora maiúsculas e considera acentos, como a RN10. O `lower()` depende do locale do banco; o banco do `docker-compose.yaml` usa `en_US.utf8`, que trata as letras acentuadas.

**Dinheiro**
- Valores em moeda ficam em `DECIMAL` no banco, e os cálculos usam centavos inteiros.

**Mercado**
- Concorrência não é tratada: duas compras simultâneas do mesmo clube conferem o limite de caixa com o valor lido antes da transação. A correção seria travar a linha do clube (`SELECT ... FOR UPDATE`).
- A recompra é recusada sempre que o clube já vendeu o jogador, sem prazo e independentemente de transferências posteriores. Outros clubes podem comprá-lo.

**Liga**
- O `result` da partida não é gravado: a tabela `partidas` do enunciado não tem essa coluna, e ele sai do placar a cada consulta.

## Funcionalidades não implementadas

Nenhuma das funcionalidades obrigatórias ficou de fora.

Diferencial não feito: registro de logs de cada requisição.

## Uso de inteligência artificial

Está no [`README.md`](../README.md#uso-de-inteligência-artificial) da raiz, com o backend e o frontend.

# Corporate Finance API

API REST para **Gestão Financeira Corporativa**, construída com NestJS 11, TypeScript (strict), PostgreSQL e Prisma ORM.

---

## Índice

1. [Stack](#stack)
2. [Arquitetura](#arquitetura)
3. [Decisões técnicas](#decisões-técnicas)
4. [Pré-requisitos e setup](#pré-requisitos-e-setup)
5. [Endpoints](#endpoints)
6. [Autenticação](#autenticação)
7. [Formato de resposta e erros](#formato-de-resposta-e-erros)
8. [Modelo de dados](#modelo-de-dados)
9. [Regras de negócio e validações](#regras-de-negócio-e-validações)
10. [Testes](#testes)
11. [Scripts npm](#scripts-npm)
12. [Produção](#produção)

---

## Stack

| Tecnologia | Uso |
|---|---|
| NestJS 11 | Framework HTTP modular |
| TypeScript (strict) | Tipagem forte em toda a aplicação |
| PostgreSQL 16 | Banco relacional |
| Prisma ORM | Acesso a dados, migrations e seed |
| JWT + Passport | Autenticação stateless |
| Swagger (OpenAPI) | Documentação interativa em `/api/docs` |
| class-validator / class-transformer | Validação e transformação de DTOs |
| bcrypt | Hash de senhas (10 salt rounds) |
| Pino (nestjs-pino) | Logging estruturado com redaction de dados sensíveis |
| Jest + Supertest | Testes unitários e e2e |

---

## Arquitetura

```
src/
├── auth/           # Register, login, JWT strategy e guard
├── users/          # Repositório e serviço de usuários
├── categories/     # CRUD de categorias
├── transactions/   # CRUD de transações com filtros e paginação
├── dashboard/      # Resumo financeiro calculado no backend
├── prisma/         # PrismaService global
├── common/         # Filters, interceptors, decorators, interfaces
├── config/         # Swagger, CORS, logger
└── testing/        # Mocks compartilhados (ex.: logger)
```

### Padrões adotados

| Padrão | Aplicação |
|---|---|
| **Modular por domínio** | Cada feature (`auth`, `categories`, `transactions`, etc.) é um módulo NestJS isolado |
| **Repository Pattern** | `Users`, `Categories` e `Transactions` encapsulam acesso ao Prisma |
| **Service Layer** | Regras de negócio e orquestração ficam nos services |
| **DTO + ValidationPipe** | Entrada HTTP validada antes de chegar ao service |
| **Guards JWT** | Rotas protegidas exigem token; apenas `/auth/register` e `/auth/login` são públicas |
| **Isolamento por usuário** | Todo recurso é filtrado pelo `userId` do token JWT |
| **Response envelope** | Respostas de sucesso padronizadas via `ResponseInterceptor` |
| **Exception filters** | Erros HTTP e Prisma mapeados para respostas JSON consistentes |

---

## Decisões técnicas

Registro das principais escolhas de design e seus motivos.

### Autenticação

| Decisão | Motivo |
|---|---|
| **JWT stateless** (sem sessão no servidor) | Simplicidade de deploy, escalabilidade horizontal e alinhamento com API REST |
| **Resposta de login/registro retorna apenas `accessToken`** | Reduz exposição de dados pessoais (id, email, timestamps) no fluxo de autenticação |
| **Senha com hash bcrypt** (nunca persistida em texto plano) | Prática padrão de segurança para credenciais |
| **Mensagem genérica `"Invalid credentials"` no login** | Evita enumeração de e-mails válidos |

### Validação de entrada

| Decisão | Motivo |
|---|---|
| **`ValidationPipe` global** com `whitelist: true` | Remove campos não declarados no DTO |
| **`forbidNonWhitelisted: true`** | Rejeita requisições com propriedades extras (ex.: `role`, `passwordHash`) |
| **`transform: true`** | Converte query params e body para os tipos do DTO automaticamente |
| **Senha mínima de 8 caracteres** no registro | Validação explícita com `@MinLength(8)` — `@ApiProperty` sozinho não whitelista campos |

### Banco de dados

| Decisão | Motivo |
|---|---|
| **`amount` como `DECIMAL(14, 2)`** | Precisão monetária; limite máximo `999999999999.99` |
| **`onDelete: Restrict` em `Transaction → Category`** | Impede exclusão acidental de categorias com transações vinculadas |
| **`onDelete: Cascade` em relações com `User`** | Ao remover usuário, categorias e transações são removidas em cascata |
| **Validação de exclusão de categoria no service** | Retorna `409 Conflict` com mensagem clara antes de tentar o DELETE no banco |
| **PostgreSQL na porta `5433` via Docker** | Evita conflito com instâncias locais na porta padrão `5432` |

### Erros e observabilidade

| Decisão | Motivo |
|---|---|
| **`PrismaExceptionFilter`** mapeia códigos conhecidos | `P2002` → 409, `P2003` → 409, `P2020` → 400, `P2025` → 404 |
| **Erros Prisma desconhecidos → 500 genérico** | Evita vazar detalhes internos do banco ao cliente |
| **Pino com redaction** | `password`, `passwordHash`, `Authorization` e cookies não aparecem nos logs |
| **Logs estruturados com `event`** | Facilita rastreamento (`auth.login.success`, `categories.delete.conflict`, etc.) |

### API e domínio

| Decisão | Motivo |
|---|---|
| **Prefixo `/api/v1`** | Versionamento explícito da API |
| **Dashboard calculado no backend** | Agregações (`sum`, `top categories`) executadas no banco, não no cliente |
| **Valores monetários retornados como `string`** | Evita perda de precisão com ponto flutuante JavaScript |
| **Paginação padrão** `page=1`, `limit=10` (máx. 100) | Controle de volume de dados em listagens |
| **Sem endpoint `/auth/me`** | Perfil do usuário pode ser exposto futuramente como rota dedicada e protegida |

---

## Pré-requisitos e setup

### Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose

### 1. Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta da API | `3000` |
| `NODE_ENV` | Ambiente | `development` |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://postgres:postgres@localhost:5433/corporate_finance?schema=public` |
| `JWT_SECRET` | Segredo para assinar tokens | string forte (mín. 32 chars em produção) |
| `JWT_EXPIRES_IN` | Expiração do token | `7d` |
| `CORS_ORIGIN` | Origens permitidas (vírgula) | `http://localhost:5173` |
| `LOG_LEVEL` | Nível de log Pino | `info` |
| `SEED_USER_*` | Credenciais do usuário inicial | ver `.env.example` |

> **Atenção:** o Docker Compose expõe PostgreSQL na porta **`5433`** (host) → `5432` (container).

### 2. Subir o PostgreSQL

```bash
docker compose up -d
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Prisma — generate e migrate

```bash
npm run prisma:generate
npm run prisma:migrate
```

Na primeira execução, informe um nome como `init` quando solicitado.

### 5. Seed (dados iniciais)

```bash
npm run prisma:seed
```

Credenciais padrão:

| Campo | Valor |
|---|---|
| Email | `admin@corporate-finance.com` |
| Senha | `Admin@123` |

### 6. Iniciar a API

```bash
# desenvolvimento (hot-reload)
npm run start:dev

# produção
npm run build
npm run start:prod
```

| Recurso | URL |
|---|---|
| API | `http://localhost:3000/api/v1` |
| Swagger | `http://localhost:3000/api/docs` |

---

## Endpoints

Prefixo global: `/api/v1`

### Auth (público)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Registrar usuário |
| POST | `/auth/login` | Autenticar e obter JWT |

### Categories (JWT)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/categories` | Criar categoria |
| GET | `/categories` | Listar categorias do usuário |
| GET | `/categories/:id` | Buscar categoria |
| PATCH | `/categories/:id` | Atualizar categoria |
| DELETE | `/categories/:id` | Remover categoria |

### Transactions (JWT)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/transactions` | Criar transação |
| GET | `/transactions` | Listar com paginação e filtros |
| GET | `/transactions/:id` | Buscar transação |
| PATCH | `/transactions/:id` | Atualizar transação |
| DELETE | `/transactions/:id` | Remover transação |

**Query params (`GET /transactions`):**

| Param | Tipo | Default | Descrição |
|---|---|---|---|
| `page` | number | `1` | Página atual |
| `limit` | number | `10` | Itens por página (máx. 100) |
| `type` | enum | — | `INCOME` ou `EXPENSE` |
| `categoryId` | UUID | — | Filtrar por categoria |
| `startDate` | ISO date | — | Ex.: `2024-01-01` |
| `endDate` | ISO date | — | Ex.: `2024-12-31` |

### Dashboard (JWT)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard` | Resumo financeiro do usuário |

**Exemplo de resposta:**

```json
{
  "success": true,
  "data": {
    "currentBalance": "40000.00",
    "totalIncome": "100000.00",
    "totalExpense": "60000.00",
    "topExpenseCategories": [
      {
        "categoryId": "uuid",
        "categoryName": "Salaries",
        "total": "40000.00"
      }
    ]
  },
  "timestamp": "2024-06-18T12:00:00.000Z"
}
```

---

## Autenticação

### Fluxo

1. `POST /auth/register` ou `POST /auth/login`
2. Receber `{ "accessToken": "..." }`
3. Enviar o token em todas as rotas protegidas:

```
Authorization: Bearer <accessToken>
```

No Swagger, use **Authorize** e informe apenas o token (sem o prefixo `Bearer`).

### Resposta de auth

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2026-06-18T12:00:00.000Z"
}
```

> Dados do usuário **não** são retornados no login/registro por decisão de segurança.

---

## Formato de resposta e erros

### Sucesso

Envelope aplicado pelo `ResponseInterceptor`:

```json
{
  "success": true,
  "data": { },
  "timestamp": "ISO-8601"
}
```

### Erro

Tratado pelos exception filters (`HttpExceptionFilter`, `PrismaExceptionFilter`):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "timestamp": "ISO-8601",
  "path": "/api/v1/..."
}
```

### Códigos HTTP comuns

| Status | Situação |
|---|---|
| `400` | Validação de DTO falhou, valor fora de range (`P2020`) |
| `401` | Token ausente, inválido ou credenciais incorretas |
| `404` | Recurso não encontrado ou não pertence ao usuário |
| `409` | E-mail duplicado (`P2002`), categoria com transações, violação de FK (`P2003`) |
| `500` | Erro interno ou Prisma não mapeado |

---

## Modelo de dados

```
User 1──* Category 1──* Transaction
  └──────────* Transaction
```

### User

| Campo | Tipo | Observação |
|---|---|---|
| `id` | UUID | PK |
| `name` | string | |
| `email` | string | unique |
| `passwordHash` | string | bcrypt — nunca exposto na API |

### Category

| Campo | Tipo | Observação |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (cascade on delete) |
| `name` | string | |
| `description` | string? | opcional |

### Transaction

| Campo | Tipo | Observação |
|---|---|---|
| `id` | UUID | PK |
| `userId` | UUID | FK → User (cascade on delete) |
| `categoryId` | UUID | FK → Category (**restrict** on delete) |
| `description` | string | |
| `amount` | decimal(14,2) | retornado como string na API |
| `transactionDate` | date | |
| `type` | enum | `INCOME` \| `EXPENSE` |

---

## Regras de negócio e validações

### Isolamento e ownership

1. Usuário só acessa seus próprios dados (`userId` extraído do JWT).
2. Categoria deve pertencer ao usuário autenticado.
3. Transação deve referenciar categoria do próprio usuário.
4. Filtro por `categoryId` em transações valida ownership antes da query.

### Categorias

- Exclusão bloqueada se existirem transações vinculadas → **409 Conflict**.
- Mensagem: `"Cannot delete category with associated transactions"`.
- Para excluir: remover ou reatribuir as transações antes.

### Transações

- `amount` deve ser positivo, com no máximo 2 casas decimais.
- `amount` máximo: **`999999999999.99`** (limite do `DECIMAL(14, 2)`).
- Valores acima do limite são rejeitados na validação do DTO (400), antes de chegar ao banco.

### Dashboard

- `currentBalance` = `totalIncome` − `totalExpense`.
- `topExpenseCategories`: categorias com maior soma de despesas.
- Cálculos executados no backend via agregações Prisma/SQL.

### Registro

- E-mail único no sistema.
- Senha: mínimo 8 caracteres.
- Campos extras no body são rejeitados (`forbidNonWhitelisted`).

---

## Testes

```bash
# unitários
npm run test

# cobertura
npm run test:cov

# e2e (requer banco disponível)
npm run test:e2e
```

### Cobertura atual

**Unitários** (`src/**/*.spec.ts`):

| Módulo | Cenários |
|---|---|
| `AuthService` | Registro, conflito de e-mail, login válido/inválido, usuário inexistente, resposta sem dados do usuário |
| `CategoriesService` | CRUD, ownership, bloqueio de delete com transações |
| `TransactionsService` | Criação com categoria válida, categoria inválida, paginação, not found |
| `DashboardService` | Cálculo de saldo e conta zerada |
| `CreateTransactionDto` | Limite de `amount` (DECIMAL 14,2) |

**E2E** (`test/*.e2e-spec.ts`):

| Cenário | Esperado |
|---|---|
| Dashboard sem token | 401 |
| Categories sem token | 401 |
| Register com senha curta | 400 |
| Register com campo extra (`role`) | 400 |

---

## Scripts npm

| Script | Descrição |
|---|---|
| `npm run start:dev` | Desenvolvimento com hot-reload |
| `npm run build` | Compilar para produção |
| `npm run start:prod` | Executar build compilado |
| `npm run test` | Testes unitários |
| `npm run test:e2e` | Testes end-to-end |
| `npm run test:cov` | Cobertura de testes |
| `npm run lint` | ESLint |
| `npm run prisma:generate` | Gerar Prisma Client |
| `npm run prisma:migrate` | Criar/aplicar migrations (dev) |
| `npm run prisma:migrate:deploy` | Aplicar migrations (prod) |
| `npm run prisma:seed` | Popular banco com dados iniciais |
| `npm run prisma:studio` | Interface visual do Prisma |

---

## Produção

1. Defina `JWT_SECRET` forte e único (mín. 32 caracteres).
2. Configure `NODE_ENV=production`.
3. Use `npm run prisma:migrate:deploy` no pipeline de deploy.
4. Ajuste `CORS_ORIGIN` para os domínios reais do frontend.
5. Não exponha `.env`, credenciais do seed nem logs com dados sensíveis.
6. Em produção, logs Pino saem em JSON (sem `pino-pretty`).

---

## Licença

UNLICENSED — uso interno corporativo.

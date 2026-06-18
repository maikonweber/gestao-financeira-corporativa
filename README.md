# Corporate Finance API

API REST para **Gestão Financeira Corporativa**, construída com NestJS 11, TypeScript (strict), PostgreSQL e Prisma ORM.

## Stack

| Tecnologia | Uso |
|---|---|
| NestJS 11 | Framework HTTP modular |
| TypeScript Strict | Tipagem forte |
| PostgreSQL 16 | Banco relacional |
| Prisma ORM | Acesso a dados e migrations |
| JWT + Passport | Autenticação stateless |
| Swagger | Documentação OpenAPI |
| class-validator / class-transformer | Validação e transformação de DTOs |
| bcrypt | Hash de senhas |
| Jest | Testes unitários |

## Arquitetura

```
src/
├── auth/           # Register, Login, JWT Strategy, Guard
├── users/          # Repositório e serviço de usuários
├── categories/     # CRUD de categorias
├── transactions/   # CRUD de transações com filtros e paginação
├── dashboard/      # Resumo financeiro calculado no backend
├── prisma/         # PrismaService global
├── common/         # Filters, Interceptors, Decorators
└── config/         # Swagger
```

### Padrões adotados

- **Arquitetura modular** por domínio (Auth, Users, Categories, Transactions, Dashboard)
- **Repository Pattern** nos módulos Users, Categories e Transactions
- **SOLID** com serviços focados e injeção de dependências
- **Guards JWT** em todas as rotas exceto `/auth/register` e `/auth/login`
- **Isolamento por usuário**: cada recurso pertence ao usuário autenticado

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose (para PostgreSQL)

## Configuração

### 1. Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta da API | `3000` |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://postgres:postgres@localhost:5432/corporate_finance?schema=public` |
| `JWT_SECRET` | Segredo para assinar tokens | string forte (mín. 32 chars em produção) |
| `JWT_EXPIRES_IN` | Expiração do token | `7d` |
| `SEED_USER_*` | Credenciais do usuário inicial | ver `.env.example` |

### 2. Subir o PostgreSQL

```bash
docker compose up -d
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Gerar client Prisma e rodar migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

Na primeira execução do migrate, informe um nome como `init` quando solicitado.

### 5. Seed (usuário e dados de exemplo)

```bash
npm run prisma:seed
```

Credenciais padrão do seed:

- **Email:** `admin@corporate-finance.com`
- **Senha:** `Admin@123`

### 6. Iniciar a API

```bash
# desenvolvimento
npm run start:dev

# produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000/api/v1`.

Documentação Swagger: `http://localhost:3000/api/docs`.

## Endpoints

Prefixo global: `/api/v1`

### Auth (público)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Registrar usuário |
| POST | `/auth/login` | Login e obtenção do JWT |

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

**Query params de filtro:**

- `page` (default: 1)
- `limit` (default: 10, max: 100)
- `type` — `INCOME` ou `EXPENSE`
- `categoryId` — UUID da categoria
- `startDate` — ISO date (`2024-01-01`)
- `endDate` — ISO date (`2024-12-31`)

### Dashboard (JWT)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/dashboard` | Resumo financeiro |

**Resposta:**

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

## Autenticação

Após login ou registro, use o token no header:

```
Authorization: Bearer <accessToken>
```

No Swagger, clique em **Authorize** e informe o token.

## Formato de resposta

Sucesso (via `ResponseInterceptor`):

```json
{
  "success": true,
  "data": { },
  "timestamp": "ISO-8601"
}
```

Erro (via Exception Filters):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "timestamp": "ISO-8601",
  "path": "/api/v1/..."
}
```

## Modelo de dados

### User

- `id` UUID
- `name`, `email` (unique), `passwordHash`
- `createdAt`, `updatedAt`

### Category

- `id` UUID, `userId`, `name`, `description?`
- Pertence a um usuário

### Transaction

- `id` UUID, `userId`, `categoryId`
- `description`, `amount` (decimal 14,2)
- `transactionDate`, `type` (`INCOME` | `EXPENSE`)

## Scripts npm

| Script | Descrição |
|---|---|
| `npm run start:dev` | Desenvolvimento com hot-reload |
| `npm run build` | Compilar para produção |
| `npm run start:prod` | Executar build compilado |
| `npm run test` | Testes unitários |
| `npm run test:cov` | Cobertura de testes |
| `npm run prisma:generate` | Gerar Prisma Client |
| `npm run prisma:migrate` | Criar/aplicar migrations (dev) |
| `npm run prisma:migrate:deploy` | Aplicar migrations (prod) |
| `npm run prisma:seed` | Popular banco com dados iniciais |
| `npm run prisma:studio` | Interface visual do Prisma |

## Testes

```bash
npm run test
```

Testes unitários cobrem:

- `AuthService` — registro, login e credenciais inválidas
- `CategoriesService` — criação e isolamento por usuário
- `TransactionsService` — criação com validação de categoria
- `DashboardService` — cálculo de saldo e totais

## Regras de negócio

1. Usuário só acessa seus próprios dados.
2. Categoria deve pertencer ao usuário autenticado.
3. Transação deve usar categoria do próprio usuário.
4. Dashboard é calculado no backend (soma por tipo + top categorias de despesa).
5. Rotas protegidas exigem JWT válido.

## Produção

1. Defina `JWT_SECRET` forte e único.
2. Use `npm run prisma:migrate:deploy` no pipeline de deploy.
3. Configure `NODE_ENV=production`.
4. Não exponha `.env` nem credenciais do seed em produção.

## Licença

UNLICENSED — uso interno corporativo.

# Sistema de Notificações

Sistema completo de notificações em tempo real com autenticação, persistência em PostgreSQL e interface web.

## Estrutura

- **Backend**: Node.js + Express + Prisma + Socket.IO + PostgreSQL
- **Frontend**: Next.js 16 + React 19 + Tailwind CSS v4 + Socket.IO Client

## Configuração

### Backend

1. Instalar dependências:
```bash
cd server
pnpm install
```

2. Configurar banco de dados no `.env` (já configurado)

3. Executar migrações:
```bash
npx prisma migrate dev
```

4. Iniciar servidor:
```bash
pnpm dev
```
- Backend roda na porta **3001**

### Frontend

1. Instalar dependências:
```bash
cd client
pnpm install
```

2. Criar arquivo `.env.local` (baseado em `env.example`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=1
```

3. Iniciar servidor:
```bash
pnpm dev
```
- Frontend roda na porta **3000**

## Usuário Admin

Usuário admin já configurado:
- **Email**: caarlosandree@gmail.com
- **Senha**: admin123

## Rotas

### Backend (API v1)

- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/users` - Listar usuários (admin)
- `POST /api/v1/users` - Criar usuário (admin)
- `GET /api/v1/users/me` - Usuário atual
- `GET /api/v1/notifications` - Listar notificações
- `POST /api/v1/notifications/user` - Enviar para usuário (admin)
- `POST /api/v1/notifications/broadcast` - Broadcast (admin)
- `PATCH /api/v1/notifications/:id/read` - Marcar como lida
- `PATCH /api/v1/notifications/read-all` - Marcar todas como lidas
- `GET /api/v1/notifications/unread-count` - Contador de não lidas

### Frontend

- `/login` - Login
- `/register` - Registro
- `/notifications` - Visualizar notificações
- `/admin/send` - Enviar notificações (admin)

## Funcionalidades

- ✅ Autenticação JWT com refresh tokens
- ✅ Sistema de usuários com roles (ADMIN/USER)
- ✅ Notificações em tempo real via Socket.IO
- ✅ Persistência no PostgreSQL
- ✅ Toast notifications com som (`som-do-zap-zap-estourado.mp3`)
- ✅ Contador de notificações não lidas
- ✅ Marcar como lida (individual ou todas)
- ✅ Página de admin para enviar notificações
- ✅ Envio para múltiplos usuários ou broadcast
- ✅ API versionada (v1)
- ✅ Cliente HTTP centralizado com interceptors

# TaskFlow — Team Task Manager

A full-stack team task management app with role-based access control, kanban boards, and real-time project tracking.

## Tech-Stack

**Backend:** Node.js · Express · PostgreSQL · Prisma ORM · JWT Auth  
**Frontend:** React 18 · Vite · TailwindCSS · TanStack Query · React Hook Form

## Features

- **Authentication** — JWT-based login/register with refresh tokens
- **Projects** — Create, manage, and track projects with team members
- **Kanban Board** — Visual task management with 4 columns (Todo → Done)
- **Task Management** — Create, assign, prioritize, and track tasks
- **Role-Based Access** — Global Admin/Member roles + project-level roles
- **Dashboard** — Stats, task distribution, overdue tracking
- **Team Management** — Admin can view and change user roles

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT secrets
npm run db:generate
npm run db:push
npm run db:seed   # optional: seed demo data
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## Deployment on Railway

### Backend

1. Create a new Railway project
2. Add a **PostgreSQL** service
3. Add a **Web Service** pointing to the `/backend` folder
4. Set environment variables:
   - `DATABASE_URL` — from Railway PostgreSQL (auto-set if linked)
   - `JWT_SECRET` — random 64-char string
   - `JWT_REFRESH_SECRET` — different random 64-char string
   - `FRONTEND_URL` — your deployed frontend URL
   - `NODE_ENV=production`
5. Railway will auto-detect `railway.json` and run the start command

### Frontend

1. Add another Railway service pointing to `/frontend`
2. Set build command: `npm run build`
3. Set start command: `npx serve dist -p $PORT`
4. Set environment variable:
   - `VITE_API_URL` — your backend Railway URL + `/api`

## Demo Credentials

| Role   | Email                        | Password  |
|--------|------------------------------|-----------|
| Admin  | admin@taskmanager.com        | admin123  |
| Member | alice@taskmanager.com        | user123   |
| Member | bob@taskmanager.com          | user123   |
| Member | carol@taskmanager.com        | user123   |

## API Endpoints

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | /api/auth/register                | Register new user        |
| POST   | /api/auth/login                   | Login                    |
| GET    | /api/auth/me                      | Get current user         |
| GET    | /api/projects                     | List projects            |
| POST   | /api/projects                     | Create project           |
| GET    | /api/projects/:id                 | Get project + tasks      |
| PATCH  | /api/projects/:id                 | Update project           |
| DELETE | /api/projects/:id                 | Delete project           |
| POST   | /api/projects/:id/members         | Add member               |
| DELETE | /api/projects/:id/members/:userId | Remove member            |
| GET    | /api/tasks                        | List tasks (filterable)  |
| POST   | /api/tasks                        | Create task              |
| PATCH  | /api/tasks/:id                    | Update task              |
| DELETE | /api/tasks/:id                    | Delete task              |
| GET    | /api/dashboard/stats              | Dashboard statistics     |
| GET    | /api/users                        | List all users           |
| PATCH  | /api/users/:id/role               | Update user role (Admin) |

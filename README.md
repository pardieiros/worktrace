# Worktrace

Worktrace is a time-tracking platform with dedicated experiences for administrators and clients. It offers project and client management, granular role-based access control (RBAC), transparent reporting, and secure authentication using cookie-based JWT tokens.

## Architecture

```
worktrace/
├── assets/                # Shared branding assets (logos, icons, og images)
├── backend/               # Django 4 + DRF backend
├── frontend/              # React + TypeScript + Vite + Tailwind frontend
├── nginx/                 # Reverse proxy configuration
├── docker-compose.yml     # Container orchestration
└── Makefile               # Helper commands for common workflows
```

### Backend

- Python 3.11+, Django 4, Django REST Framework
- Postgres as the relational database
- Authentication via `django-rest-framework-simplejwt` using HttpOnly cookies and CSRF tokens
- Role-based access (`ADMIN`, `CLIENT`)
- Pagination, filtering (`django-filter`), ordering, OpenAPI docs with `drf-spectacular`
- Reporting service with CSV/PDF exports (WeasyPrint)
- Management commands for superuser creation and demo data seeding
- Tests written with `pytest` and `pytest-django`

### Frontend

- React 18, TypeScript, Vite
- Tailwind CSS with Worktrace theme (primary: `#1E88E5`)
- Zustand for state management, React Query for data fetching
- React Router for client/admin areas
- Recharts for charts, shadcn-inspired UI components
- Vitest + React Testing Library for unit tests

### Containerization

- Docker Compose orchestrates `backend`, `frontend`, `db` (Postgres) and `nginx`
- `nginx` proxies `/api` to Django and serves the Vite preview server
- Static files collected to a shared volume exposed through Nginx

## Getting Started

### Prerequisites

- Docker Desktop (or Docker Engine + Compose plugin)
- Make (optional but recommended)

### Environment Variables

Copy the `.env.example` file and adjust values as needed:

```bash
cp .env.example .env
```

Key variables:

- `DJANGO_SECRET_KEY`: Django secret key
- `DJANGO_DEBUG`: Enable/disable debug mode
- `DATABASE_URL`: Postgres connection string (Compose default works out of the box)
- `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`: SPA origin whitelist
- `JWT_COOKIE_SECURE`: Toggle secure cookies (set to `True` in production)
- `TIMEENTRY_ALLOW_OVERLAP`: Guard against overlapping time entries per user/day

### Run with Docker Compose

```bash
make up
```

The services will be available at:

- Frontend (via Nginx proxy): http://localhost:8080
- Django API: http://localhost:8000/api/
- Postgres: `localhost:5432` (internal access only)
- API documentation: http://localhost:8000/api/docs/

To stop the stack:

```bash
make down
```

### Database and Demo Users

Apply migrations and create the default admin user:

```bash
make migrate
make createsu
```

Optional: seed demo data (client, projects, assignments, time entries):

```bash
make seed
```

Default demo credentials:

- Admin: `admin@worktrace.demo` / `demo1234`
- Client: `client@worktrace.demo` / `demo1234`

### Local Development (outside Docker)

1. **Backend**
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements-dev.txt
   python manage.py migrate
   python manage.py runserver
   ```
2. **Frontend**
   ```bash
   cd frontend
  npm install
   npm run dev
   ```
   Vite automatically proxies `/api` requests to `http://localhost:8000`.

### Authentication Flow

- `POST /api/auth/login` sets access and refresh JWT tokens in HttpOnly cookies and issues a CSRF token.
- SPA requests include the CSRF token via `X-CSRFToken` header (managed by the frontend).
- Refresh tokens are rotated automatically via `/api/auth/refresh`.
- `POST /api/auth/logout` clears HttpOnly cookies server-side.

### RBAC

- **ADMIN**: Full CRUD over clients, projects, assignments, hourly rates, time entries, reporting, and settings.
- **CLIENT**: Read-only access to projects and reports associated with their organisation. Cannot modify data.

Permissions are enforced at the API layer via custom DRF permissions, queryset filtering, and assignment checks.

### Testing & Linting

```bash
# Backend tests
make test-backend

# Frontend tests
make test-frontend

# Backend format/lint
docker compose run --rm backend black .
docker compose run --rm backend flake8

# Frontend lint/format
docker compose run --rm frontend npm run lint
```

### API Reference

Generated OpenAPI schema and Swagger UI are exposed at:

- Schema: `/api/schema/`
- Swagger UI: `/api/docs/`
- Redoc UI: `/api/docs/redoc/`

The auth flow is documented inline with serializers and views, and reporting endpoints expose query parameters for period, client, project, and user filtering.

## Make Targets

| Command            | Description                                  |
|--------------------|----------------------------------------------|
| `make up`          | Build and start all containers                |
| `make down`        | Stop containers and remove network           |
| `make migrate`     | Run Django migrations inside the backend     |
| `make createsu`    | Create an initial superuser                  |
| `make seed`        | Populate demo data                           |
| `make test-backend`| Run backend test suite                       |
| `make test-frontend` | Run frontend test suite                   |

## Additional Notes

- Nginx is hardened to proxy only the necessary headers and serve collected static files.
- DRF throttling is enabled for both anonymous and authenticated users to mitigate abuse.
- The codebase follows WCAG AA contrast requirements, responsive layout, and keyboard-accessible controls.
- Branding assets (logo, icon, social cover) are consumed directly from the shared `assets/` directory to avoid duplication.



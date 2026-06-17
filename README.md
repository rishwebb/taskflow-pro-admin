# TaskFlow Pro Admin Dashboard

Production-ready React, TypeScript, Vite, and Tailwind CSS admin dashboard for TaskFlow Pro.

## Quick Start

```bash
cd admin-dashboard
cp .env.example .env
npm install
npm run dev
```

The dashboard runs on:

```text
http://localhost:5174
```

Set the backend URL in `.env`:

```text
VITE_API_BASE_URL=https://taskflow-pro-backend-qbtw.onrender.com
```

## Backend Integration

The dashboard connects to the existing backend routes:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /health`
- `GET /api/tasks`
- `GET /api/tasks/stats`
- `GET /api/notifications`

Admin-only management screens are wired to conventional admin endpoints under `/api/admin/*`. If those endpoints are not present, the dashboard stays usable in authenticated-admin scope and shows the backend availability state.

Expected admin endpoints for full platform-wide management:

- `GET /api/admin/overview`
- `GET /api/admin/users?search=`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id/disable`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/tasks?search=`
- `DELETE /api/admin/tasks/:id`
- `GET /api/admin/notifications`
- `GET /api/admin/system`

## Auth

Admin login requires the backend user response to include:

```json
{
  "role": "admin"
}
```

Non-admin accounts are rejected client-side after login.

## Build

```bash
npm run build
```

## Structure

```text
src/
  components/
  contexts/
  hooks/
  lib/
  pages/
  services/
  types/
```

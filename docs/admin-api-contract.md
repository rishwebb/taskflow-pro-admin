# Admin API Contract

The dashboard is already connected to the current TaskFlow Pro backend for authentication, health, current-admin tasks, and current-admin notifications.

For full platform-wide admin management, expose these authenticated routes from the backend. They should require `req.user.role === "admin"`.

## Overview

### GET `/api/admin/overview`

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 120,
      "activeUsers": 98,
      "totalTasks": 640,
      "completedTasks": 412,
      "highPriorityTasks": 44,
      "recentRegistrations": []
    }
  }
}
```

## Users

### GET `/api/admin/users?search=&page=1&limit=50`

```json
{
  "success": true,
  "data": {
    "users": [],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 0,
      "pages": 0
    }
  }
}
```

### GET `/api/admin/users/:id`

Returns `{ "user": {} }`.

### PATCH `/api/admin/users/:id/disable`

Disables a user and returns `{ "user": {} }`.

### DELETE `/api/admin/users/:id`

Deletes a user.

## Tasks

### GET `/api/admin/tasks?search=&page=1&limit=50`

Returns all tasks with optional user summary on each task:

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task-id",
        "title": "Task",
        "priority": "high",
        "completed": false,
        "userId": "user-id",
        "user": {
          "id": "user-id",
          "name": "Rishav",
          "email": "rishav@example.com"
        }
      }
    ]
  }
}
```

### DELETE `/api/admin/tasks/:id`

Deletes any user task.

## Notifications

### GET `/api/admin/notifications`

Returns system-wide notifications:

```json
{
  "success": true,
  "data": {
    "notifications": []
  }
}
```

## System

### GET `/api/admin/system`

```json
{
  "success": true,
  "data": {
    "api": {
      "service": "TaskFlow Pro API",
      "status": "ok",
      "database": "connected",
      "timestamp": 1760000000000,
      "version": "1.0.0"
    },
    "environment": {
      "nodeEnv": "production",
      "apiBaseUrl": "https://api.example.com",
      "adminEndpointsAvailable": true
    }
  }
}
```

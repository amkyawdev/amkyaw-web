# AmkyawDev API Documentation

## Overview

This document provides comprehensive API documentation for the AmkyawDev website backend.

## Base URL

```
/server/api
```

## Endpoints

### Templates

#### Get All Templates
```
GET /server/api/templates
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Portfolio Pro",
    "price": 10,
    "image": "assets/images/templates/p1.png",
    "category": "portfolio",
    "description": "Modern portfolio template",
    "features": ["Responsive", "3D Animation"],
    "demoUrl": "https://demo.example.com",
    "createdAt": "2024-01-01",
    "downloads": 150
  }
]
```

#### Get Template by ID
```
GET /server/api/templates/:id
```

#### Create Template
```
POST /server/api/templates
Content-Type: application/json

{
  "name": "New Template",
  "category": "portfolio",
  "price": 15,
  "description": "Template description",
  "features": ["Feature 1", "Feature 2"]
}
```

### Projects

#### Get All Projects
```
GET /server/api/projects
```

#### Get Project by ID
```
GET /server/api/projects/:id
```

### Chat

#### Send Message
```
POST /server/api/chat/messages
Content-Type: application/json

{
  "conversationId": "123",
  "message": "Hello",
  "sender": "user"
}
```

### Docs

#### Get All Docs
```
GET /server/api/docs
```

## Authentication

Some endpoints require authentication via Bearer token:

```
Authorization: Bearer <token>
```

## Rate Limiting

- Auth endpoints: 5 requests per 15 minutes
- API endpoints: 100 requests per minute
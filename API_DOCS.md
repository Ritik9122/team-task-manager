# Team Task Manager - API Documentation

## Base URL
```
Local: http://localhost:5000/api
Production: [Your deployed URL]/api
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require:
```
Header: Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"  // optional, defaults to "member"
}

Response (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer <token>

Response (200):
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get All Users
```
GET /auth/users
Headers: Authorization: Bearer <token> (admin only)

Response (200):
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member"
    },
    ...
  ]
}
```

---

## 🏗️ Project Endpoints

### Create Project
```
POST /projects
Headers: Authorization: Bearer <token> (admin only)
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Modernize company website",
  "members": ["507f1f77bcf86cd799439011"]  // optional
}

Response (201):
{
  "message": "Project created successfully",
  "project": {
    "_id": "607f1f77bcf86cd799439012",
    "name": "Website Redesign",
    "description": "Modernize company website",
    "members": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "createdBy": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Admin",
      "email": "admin@example.com"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get All Projects
```
GET /projects
Headers: Authorization: Bearer <token>

Response (200):
{
  "projects": [
    {
      "_id": "607f1f77bcf86cd799439012",
      "name": "Website Redesign",
      "description": "Modernize company website",
      "members": [...],
      "createdBy": {...},
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Project by ID
```
GET /projects/:id
Headers: Authorization: Bearer <token>

Response (200):
{
  "project": { ... }
}
```

### Update Project
```
PUT /projects/:id
Headers: Authorization: Bearer <token> (admin or creator)
Content-Type: application/json

{
  "name": "Website Redesign v2",
  "description": "New description",
  "members": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}

Response (200):
{
  "message": "Project updated successfully",
  "project": { ... }
}
```

### Delete Project
```
DELETE /projects/:id
Headers: Authorization: Bearer <token> (admin or creator)

Response (200):
{
  "message": "Project deleted successfully"
}
```

### Add Project Member
```
POST /projects/:id/members
Headers: Authorization: Bearer <token> (admin only)
Content-Type: application/json

{
  "memberId": "507f1f77bcf86cd799439011"
}

Response (200):
{
  "message": "Member added successfully",
  "project": { ... }
}
```

### Remove Project Member
```
DELETE /projects/:id/members/:memberId
Headers: Authorization: Bearer <token> (admin only)

Response (200):
{
  "message": "Member removed successfully",
  "project": { ... }
}
```

---

## ✅ Task Endpoints

### Create Task
```
POST /tasks
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create modern homepage design",
  "dueDate": "2024-02-15",
  "assignedTo": "507f1f77bcf86cd799439011",
  "projectId": "607f1f77bcf86cd799439012"
}

Response (201):
{
  "message": "Task created successfully",
  "task": {
    "_id": "607f1f77bcf86cd799439013",
    "title": "Design homepage",
    "description": "Create modern homepage design",
    "status": "Pending",
    "dueDate": "2024-02-15T00:00:00Z",
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "project": {
      "_id": "607f1f77bcf86cd799439012",
      "name": "Website Redesign"
    },
    "createdBy": {...},
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Tasks
```
GET /tasks?projectId=<id>&status=<status>
Headers: Authorization: Bearer <token>

Query Parameters (optional):
- projectId: Filter by project ID
- status: Filter by status (Pending, In Progress, Done)

Response (200):
{
  "tasks": [
    { ... }
  ]
}
```

### Get Task by ID
```
GET /tasks/:id
Headers: Authorization: Bearer <token>

Response (200):
{
  "task": { ... }
}
```

### Update Task
```
PUT /tasks/:id
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "title": "New title",  // optional
  "description": "New description",  // optional
  "dueDate": "2024-02-20",  // optional
  "assignedTo": "507f1f77bcf86cd799439011"  // optional (admin only)
}

Response (200):
{
  "message": "Task updated successfully",
  "task": { ... }
}
```

### Delete Task
```
DELETE /tasks/:id
Headers: Authorization: Bearer <token> (admin or creator)

Response (200):
{
  "message": "Task deleted successfully"
}
```

### Get Dashboard Stats
```
GET /tasks/dashboard/stats
Headers: Authorization: Bearer <token>

Response (200):
{
  "stats": {
    "totalTasks": 15,
    "completedTasks": 5,
    "pendingTasks": 7,
    "inProgressTasks": 3,
    "overdueTasks": 2
  }
}
```

---

## 🔄 Task Status Values
- `Pending` - Not started
- `In Progress` - Currently being worked on
- `Done` - Completed

---

## 👥 User Roles
- `admin` - Full access, can create projects, manage members
- `member` - Can create tasks, update their own task status

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid credentials"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Project not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "error details"
}
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Projects (with token)
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Database Schema

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin | member),
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  members: [ObjectId], // References to User
  createdBy: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (Pending | In Progress | Done),
  dueDate: Date,
  assignedTo: ObjectId, // Reference to User
  project: ObjectId, // Reference to Project
  createdBy: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

---

**Happy API usage! 🚀**

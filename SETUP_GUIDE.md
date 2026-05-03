# Team Task Manager - Complete Setup & Running Guide

## ✅ What's Already Implemented

### Backend
- ✅ User authentication (register, login) with JWT
- ✅ Project CRUD operations (create, read, update, delete)
- ✅ Task CRUD operations with status tracking (Pending, In Progress, Done)
- ✅ Role-based access control (admin, member)
- ✅ User-based data filtering (only see your projects/tasks)
- ✅ Dashboard statistics (total, completed, pending, overdue tasks)
- ✅ Member management for projects
- ✅ MongoDB integration

### Frontend
- ✅ Beautiful React UI with Tailwind CSS
- ✅ Login & signup pages
- ✅ Dashboard with real-time stats
- ✅ Projects page (create, edit, delete projects)
- ✅ Tasks page (create, update status, delete tasks)
- ✅ Responsive design
- ✅ Error handling and loading states

---

## 🚀 Quick Start

### Prerequisites
- Node.js & npm installed
- MongoDB Atlas account set up
- Your IP whitelisted in MongoDB Atlas (`106.194.122.195` for your machine)

### Step 1: Start Backend
```bash
cd "d:\4th year\team-task-manager\backend"
npm install  # First time only
npm run dev
```

Expected output:
```
MONGODB_URI: mongodb+srv://...
PORT: 5000
[nodemon] starting `node server.js`
Server running on port 5000
```

### Step 2: Start Frontend (in another terminal)
```bash
cd "d:\4th year\team-task-manager\frontend"
npm install  # First time only
npm run dev
```

Expected output:
```
Local: http://localhost:3000/
```

### Step 3: Test the App
- Open `http://localhost:3000/`
- Sign up with: `email: test@example.com` and `password: password`
- Create projects and tasks
- Update task status
- Delete projects/tasks

---

## 📊 Features Breakdown

### Authentication
- Register new users (default role: member)
- Login with email/password
- JWT token-based sessions
- Automatic logout on token expiry

### Projects
**Admin only:**
- Create projects
- Edit project name/description
- Delete projects
- Add/remove members

**All users:**
- View projects they're assigned to
- See project members

### Tasks
**All users:**
- Create tasks within projects
- Assign tasks to project members
- Update task status: `Pending → In Progress → Done`
- Delete tasks they created (admins can delete any)

**Dashboard:**
- Total tasks
- Tasks in progress
- Pending tasks
- Completed tasks
- Overdue tasks

---

## 🔧 Environment Setup

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb+srv://ritikgupta912266_db_user:Galgotias%409122@cluster0.np5tjxu.mongodb.net/team-task-manager
JWT_SECRET=123456
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── middleware/
│   │   ├── auth.js          (JWT verification)
│   │   └── roleCheck.js     (Role-based access)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   └── Tasks.jsx
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── services/
    │   │   └── api.js        (Axios setup)
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## 🐛 Troubleshooting

### Issue: "Network error" on login
**Solution:**
1. Check MongoDB IP whitelist: `106.194.122.195`
2. Verify backend is running: `http://localhost:5000/api/health`
3. Check `.env` files are set correctly

### Issue: Backend won't start
**Check:**
```bash
# Navigate to backend folder
cd "d:\4th year\team-task-manager\backend"

# Check if node_modules exists
ls node_modules  

# If not, install:
npm install

# Try starting again:
npm run dev
```

### Issue: Frontend won't load
**Check:**
1. Backend is running on `http://localhost:5000`
2. Frontend `.env` has correct `VITE_API_URL`
3. Clear browser cache and refresh

---

## 📝 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/users` - Get all users (admin only)

### Projects (all require auth)
- `POST /api/projects` - Create (admin only)
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update (admin/creator only)
- `DELETE /api/projects/:id` - Delete (admin/creator only)
- `POST /api/projects/:id/members` - Add member (admin only)
- `DELETE /api/projects/:id/members/:memberId` - Remove member (admin only)

### Tasks (all require auth)
- `POST /api/tasks` - Create
- `GET /api/tasks` - Get tasks (with filters)
- `GET /api/tasks/dashboard/stats` - Dashboard stats
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update
- `DELETE /api/tasks/:id` - Delete (admin/creator only)

---

## 💡 Extra Features to Add Later

1. **Search & Filters**
   - Search tasks by title/description
   - Filter by status, project, due date
   - **Status:** Already implemented ✅

2. **Real-time Notifications**
   - WebSocket integration
   - Task assignment alerts
   - Status change notifications

3. **File Attachments**
   - Upload files to tasks
   - Share documents in comments

4. **Comments/Discussions**
   - Add comments to tasks
   - Team discussions

5. **Activity Logs**
   - Track who did what and when
   - Audit trail

6. **Mobile App**
   - React Native mobile version
   - iOS/Android support

---

## 📚 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose
- **Security:** JWT tokens, bcrypt hashing, role-based access
- **Dev Tools:** Nodemon, ESLint

---

## ✨ Next Steps

1. ✅ **Done:** CRUD functionality
2. ✅ **Done:** Authentication & authorization
3. ✅ **Done:** Dashboard stats
4. 🔲 **Test:** Create projects and tasks
5. 🔲 **Test:** Update task statuses
6. 🔲 **Test:** Verify dashboard updates in real-time
7. 📝 **Deploy:** Push to production (Render/Railway + Vercel/Netlify)

---

## 🎯 Sample Test Cases

### Create Project
1. Login as admin
2. Go to Projects page
3. Fill in: Name="Website Redesign", Description="Modernize company site"
4. Click "Create Project"
5. ✅ Should appear in list

### Create Task
1. Go to Tasks page
2. Select project
3. Fill in: Title="Design homepage", Due="2026-05-10", Assign="yourself"
4. Click "Create Task"
5. ✅ Should appear with "Pending" status

### Update Task Status
1. Click status buttons: "Pending" → "In Progress" → "Done"
2. ✅ Dashboard stats should update in real-time

---

**Happy coding! 🚀**

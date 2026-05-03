# Team Task Manager - Testing Guide

## ✅ Pre-Testing Checklist

- [ ] Backend is running on `http://localhost:5000`
- [ ] Frontend is running on `http://localhost:3000`
- [ ] MongoDB is accessible (IP whitelisted)
- [ ] `.env` files are properly configured
- [ ] No errors in console

---

## 🧪 Test Scenarios

### Test 1: User Registration & Login

**Steps:**
1. Open `http://localhost:3000`
2. Click "Create an account"
3. Fill in:
   - Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `password123`
4. Click "Create account"
5. You should be redirected to dashboard

**Expected Result:**
- ✅ User created in MongoDB
- ✅ JWT token stored in localStorage
- ✅ Redirected to `/dashboard`

**Verify:**
```bash
# In browser console:
localStorage.getItem('token')  // Should return a JWT token
```

---

### Test 2: Dashboard Page Loads

**Steps:**
1. After login, go to Dashboard
2. Check if stats load

**Expected Result:**
- ✅ Dashboard displays user info
- ✅ Shows "Total Tasks: 0" (or current count)
- ✅ No error messages
- ✅ Quick action buttons visible

---

### Test 3: Create Project (Admin Only)

**Prerequisites:**
- Create admin user with role "admin" (modify code or use MongoDB directly)

**Steps:**
1. Login as admin
2. Go to Projects page
3. Fill in form:
   - Project name: `My First Project`
   - Description: `A test project for the app`
4. Click "Create Project"

**Expected Result:**
- ✅ Project appears in the list
- ✅ No errors in console
- ✅ API call succeeds (check Network tab)

**API Test:**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Backend API Project",
    "description": "Test project creation via API"
  }'
```

---

### Test 4: Create Task

**Steps:**
1. Go to Tasks page
2. Select a project from dropdown
3. Fill in form:
   - Task title: `Homepage Design`
   - Description: `Create homepage layout and design`
   - Due date: `2024-02-15`
   - Assign to: `Select a member`
4. Click "Create Task"

**Expected Result:**
- ✅ Task appears in list with "Pending" status
- ✅ Task shows correct project
- ✅ Assigned member name displays
- ✅ Dashboard stats update

---

### Test 5: Update Task Status

**Steps:**
1. On Tasks page, find a task
2. Click the "In Progress" button
3. Observe status change

**Expected Result:**
- ✅ Status button becomes highlighted
- ✅ Dashboard "In Progress" count increases
- ✅ API returns success (Network tab)

**All Status Transitions:**
- Pending → In Progress → Done
- Done → Pending (any direction works)

---

### Test 6: Delete Task

**Steps:**
1. Find a task
2. Click "Delete" button
3. Confirm action (if prompted)

**Expected Result:**
- ✅ Task disappears from list
- ✅ Dashboard stats update
- ✅ No errors in console

---

### Test 7: Project Member Management (Admin)

**Steps:**
1. Go to Projects page
2. Find "Project members" section
3. Select a user from dropdown
4. Click "Add member"

**Expected Result:**
- ✅ Member appears in member list
- ✅ Member can now be assigned tasks

**Remove Member:**
1. Click "Remove" button next to member
2. Click "Delete" when confirmed

**Expected Result:**
- ✅ Member removed from project
- ✅ No errors

---

### Test 8: Role-Based Access Control

**Admin Abilities:**
- ✅ Create projects
- ✅ Edit projects
- ✅ Delete projects
- ✅ Manage project members
- ✅ Create tasks
- ✅ Delete any task
- ✅ View all users

**Member Abilities:**
- ✅ Create tasks (in projects they're members of)
- ✅ Update task status
- ✅ Delete tasks they created
- ✅ View only their projects/tasks

**Test:**
1. Create task as member
2. Try to edit project (should fail)
3. Try to view all users (should fail)

---

### Test 9: Search & Filter

**Search by Task Name:**
1. Type in search box: `homepage`
2. Only tasks with "homepage" should appear

**Filter by Status:**
1. Select "In Progress" from status dropdown
2. Only "In Progress" tasks should show

**Filter by Project:**
1. Select a project from dropdown
2. Only tasks in that project should appear

---

### Test 10: Error Handling

**Test Invalid Login:**
1. Go to Login page
2. Enter wrong password
3. Should see error: "Invalid credentials"

**Test Network Error:**
1. Stop backend server
2. Try to load projects
3. Should see network error message

**Test Invalid Task Creation:**
1. Create task without selecting project
2. "Create Task" button should be disabled

---

### Test 11: Real-time Updates

**Steps:**
1. Create a task in one tab/window
2. Open tasks in another tab
3. Refresh the second tab
4. New task should appear

**Expected Result:**
- ✅ Data persists in database
- ✅ Can be fetched from any session
- ✅ All users see same data (if assigned)

---

### Test 12: Dashboard Statistics

**Manual Test:**
1. Create 5 tasks
2. Mark 2 as "In Progress"
3. Mark 1 as "Done"
4. Check dashboard

**Expected:**
- Total Tasks: 5
- Pending: 2
- In Progress: 2
- Completed: 1
- Overdue: 0 (unless due date passed)

---

### Test 13: Logout

**Steps:**
1. Click profile/logout button
2. Should redirect to login

**Expected:**
- ✅ Token removed from localStorage
- ✅ Redirected to `/login`
- ✅ Cannot access `/dashboard` (protected route)

---

### Test 14: Token Expiry

**Steps:**
1. Login
2. Wait 7 days (or manually modify token expiry in JWT_SECRET)
3. Try to access protected route
4. Should be logged out

---

## 🐛 Common Issues & Fixes

### Issue: "Network Error" on Login
```
Cause: Backend not running
Fix: 
1. Check if backend is running: curl http://localhost:5000/api/health
2. Check MongoDB connection
3. Restart backend
```

### Issue: Tasks Not Showing
```
Cause: User not assigned to project
Fix:
1. As admin, add user to project
2. Refresh page
3. Create new task
```

### Issue: CORS Error
```
Cause: API_URL mismatch
Fix:
1. Check frontend .env: VITE_API_URL=http://localhost:5000/api
2. Check backend server.js has cors() enabled
3. Restart both servers
```

### Issue: Can't Delete Own Task
```
Cause: Only creator or admin can delete
Fix:
1. Use admin account to delete
2. Or delete task you created
```

---

## 📋 Manual Test Checklist

- [ ] User can register
- [ ] User can login
- [ ] Dashboard loads with stats
- [ ] Can create project (admin)
- [ ] Can view projects
- [ ] Can edit project (admin)
- [ ] Can delete project (admin)
- [ ] Can add member to project (admin)
- [ ] Can remove member (admin)
- [ ] Can create task
- [ ] Can update task status
- [ ] Can delete task (if creator/admin)
- [ ] Task status updates dashboard
- [ ] Search filters work
- [ ] Error messages display correctly
- [ ] Can logout
- [ ] Protected routes work

---

## 🔍 API Testing with Postman

1. Import this collection or create requests:

**Collection Variables:**
```
base_url: http://localhost:5000/api
token: <JWT token from login>
projectId: <Project ID>
taskId: <Task ID>
```

**Requests:**
```
1. POST {{base_url}}/auth/register
2. POST {{base_url}}/auth/login
3. GET {{base_url}}/projects
4. POST {{base_url}}/projects
5. POST {{base_url}}/tasks
6. GET {{base_url}}/tasks
7. PUT {{base_url}}/tasks/{{taskId}}
8. DELETE {{base_url}}/tasks/{{taskId}}
```

---

## ✅ Final Verification

Run this before deployment:

1. ✅ All CRUD operations work
2. ✅ Authentication works
3. ✅ Authorization works
4. ✅ No console errors
5. ✅ No network errors
6. ✅ Dashboard stats update
7. ✅ Search/filters work
8. ✅ Responsive design works
9. ✅ Error messages display
10. ✅ User data is private

---

**You're ready to deploy! 🚀**

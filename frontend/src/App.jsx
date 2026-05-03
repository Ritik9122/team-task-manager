import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import { getCurrentUser } from './services/api'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    getCurrentUser()
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Layout user={user} setUser={setUser}>
                  <Dashboard user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute user={user}>
                <Layout user={user} setUser={setUser}>
                  <Projects user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute user={user}>
                <Layout user={user} setUser={setUser}>
                  <Tasks user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div className="p-8">Page not found</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

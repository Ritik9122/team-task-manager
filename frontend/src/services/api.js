import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (payload) => api.post('/auth/register', payload)
export const login = (payload) => api.post('/auth/login', payload)
export const getCurrentUser = () => api.get('/auth/me')
export const getDashboardStats = () => api.get('/tasks/dashboard/stats')
export const getProjects = () => api.get('/projects')
export const createProject = (payload) => api.post('/projects', payload)
export const updateProject = (id, payload) => api.put(`/projects/${id}`, payload)
export const deleteProject = (id) => api.delete(`/projects/${id}`)
export const addProjectMember = (id, payload) => api.post(`/projects/${id}/members`, payload)
export const removeProjectMember = (projectId, memberId) => api.delete(`/projects/${projectId}/members/${memberId}`)
export const getTasks = (params) => api.get('/tasks', { params })
export const createTask = (payload) => api.post('/tasks', payload)
export const updateTask = (id, payload) => api.put(`/tasks/${id}`, payload)
export const deleteTask = (id) => api.delete(`/tasks/${id}`)
export const getUsers = () => api.get('/auth/users')

export default api

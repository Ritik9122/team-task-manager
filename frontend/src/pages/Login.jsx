import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api'

function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getErrorMessage = (err) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Login failed. Please try again.'
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login({ email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl md:flex-row">
        <div className="hidden flex-1 bg-sky-700 p-12 text-white md:block">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold">Welcome Back</h1>
            <p className="max-w-md text-sm text-slate-200">
              Log in to manage projects, assign tasks, and keep your team aligned with your goals.
            </p>
            <div className="space-y-4 rounded-3xl bg-sky-600/10 p-6 text-sm text-slate-100">
              <p className="font-semibold">Quick tips</p>
              <p>Use the dashboard to track overdue work.</p>
              <p>Invite members to projects for faster task assignment.</p>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 bg-slate-50 p-10 sm:p-12">
          <h1 className="text-3xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-3 text-sm text-slate-600">Enter your account information to access the task manager.</p>
          {error && <div className="mt-6 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold text-white transition ${
                loading ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-600">
            New to the app?{' '}
            <Link to="/signup" className="font-semibold text-sky-600 hover:text-sky-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

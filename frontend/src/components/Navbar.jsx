import { NavLink, useNavigate } from 'react-router-dom'

function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Team Task Manager</h1>
          <p className="text-sm text-slate-500">Role: {user?.role}</p>
        </div>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'rounded-full bg-sky-600 px-4 py-2 text-white' : 'rounded-full px-4 py-2 text-slate-700 hover:bg-slate-100'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? 'rounded-full bg-sky-600 px-4 py-2 text-white' : 'rounded-full px-4 py-2 text-slate-700 hover:bg-slate-100'
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? 'rounded-full bg-sky-600 px-4 py-2 text-white' : 'rounded-full px-4 py-2 text-slate-700 hover:bg-slate-100'
            }
          >
            Tasks
          </NavLink>
          <button
            className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar

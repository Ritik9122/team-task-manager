import { NavLink } from 'react-router-dom'

function Layout({ user, setUser, children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-600 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Team Task Manager</p>
            <h1 className="mt-3 text-3xl font-semibold">Productive teams, simpler work</h1>
            <p className="mt-2 max-w-2xl text-sm text-sky-100/90">
              Manage projects, assign tasks, and track progress with clean workflow tools for admin and member teams.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <NavLink
              to="/dashboard"
              className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/25"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/projects"
              className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/25"
            >
              Projects
            </NavLink>
            <NavLink
              to="/tasks"
              className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/25"
            >
              Tasks
            </NavLink>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.26em] text-slate-500">View as</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                {user?.role}
              </span>
            </div>
            <nav className="space-y-3">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                Analytics
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                Projects
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                Tasks
              </NavLink>
            </nav>
          </aside>

          <main className="rounded-3xl bg-white p-6 shadow-sm">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default Layout

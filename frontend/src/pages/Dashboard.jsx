import { useEffect, useState } from 'react'
import { getDashboardStats } from '../api'

function Dashboard({ user }) {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getDashboardStats()
      .then((response) => setStats(response.data.stats))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const cards = stats
    ? [
        { label: 'Total Tasks', value: stats.totalTasks, color: 'from-sky-500 to-indigo-500' },
        { label: 'In Progress', value: stats.inProgressTasks, color: 'from-emerald-500 to-sky-500' },
        { label: 'Pending', value: stats.pendingTasks, color: 'from-amber-500 to-orange-500' },
        { label: 'Completed', value: stats.completedTasks, color: 'from-teal-500 to-emerald-500' },
        { label: 'Overdue', value: stats.overdueTasks, color: 'from-rose-500 to-red-500' }
      ]
    : []

  return (
    <div className="space-y-6">
      {loading && (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600 shadow-sm">
          Loading dashboard data…
        </div>
      )}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Hello, {user?.name}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your current workspace</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Insights, task health, and project status for your team. Use the quick links to jump into work.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm">
              Role: {user?.role}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm">
              Active tasks: {stats?.totalTasks ?? '...'}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700 shadow-sm">{error}</div>}

      <div className="grid gap-4 xl:grid-cols-3">
        {stats ? (
          cards.map((card) => (
            <div key={card.label} className="rounded-3xl overflow-hidden shadow-sm">
              <div className={`bg-gradient-to-r ${card.color} px-6 py-5 text-white`}>
                <p className="text-sm uppercase tracking-[0.2em] opacity-90">{card.label}</p>
                <p className="mt-4 text-4xl font-semibold">{card.value}</p>
              </div>
              <div className="bg-white p-6 text-sm text-slate-600">
                {card.label === 'Overdue'
                  ? 'Focus on overdue tasks first to keep your team on schedule.'
                  : card.label === 'Completed'
                  ? 'Good job! Keep moving tasks to completion.'
                  : 'Monitor this metric to keep work on track.'}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm">Loading dashboard data…</div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <a href="/projects" className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
            Browse Projects
          </a>
          <a href="/tasks" className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
            Review Tasks
          </a>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-700">
            {user?.role === 'admin' ? 'Admin access enabled' : 'Standard member access'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

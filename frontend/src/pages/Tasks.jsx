import { useEffect, useMemo, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask, getProjects } from '../api'

function Tasks({ user }) {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [filters, setFilters] = useState({ search: '', status: 'All', projectId: '' })
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', assignedTo: '', projectId: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getTasks()
      setTasks(response.data.tasks || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      const response = await getProjects()
      const projectList = response.data.projects || []
      setProjects(projectList)
      if (projectList.length > 0 && !form.projectId) {
        setForm((prev) => ({ ...prev, projectId: projectList[0]._id }))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load projects')
    }
  }

  useEffect(() => {
    loadTasks()
    loadProjects()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createTask(form)
      setForm({ title: '', description: '', dueDate: '', assignedTo: '', projectId: '' })
      loadTasks()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create task')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (taskId, status) => {
    setSaving(true)
    setError('')
    try {
      await updateTask(taskId, { status })
      loadTasks()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (taskId) => {
    setSaving(true)
    setError('')
    try {
      await deleteTask(taskId)
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task')
    } finally {
      setSaving(false)
    }
  }

  const selectedProject = projects.find((project) => project._id === form.projectId)

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchText = [task.title, task.description, task.project?.name, task.assignedTo?.name, task.assignedTo?.email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const searchMatch = searchText.includes(filters.search.toLowerCase())
      const statusMatch = filters.status === 'All' || task.status === filters.status
      const projectMatch = !filters.projectId || task.project?._id === filters.projectId
      return searchMatch && statusMatch && projectMatch
    })
  }, [tasks, filters])

  return (
    <div className="space-y-6">
      {loading && (
        <div className="rounded-3xl bg-slate-50 p-4 text-slate-600 shadow-sm">Loading tasks…</div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Tasks</h1>
            <p className="mt-2 text-sm text-slate-600">Create tasks, assign teammates, and stay on schedule.</p>
          </div>
          <div className="grid gap-3 sm:grid-flow-col sm:auto-cols-max">
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
              placeholder="Search tasks"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              {['All', 'Pending', 'In Progress', 'Done'].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
              value={filters.projectId}
              onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
            >
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Create a new task</h2>
        <form className="mt-5 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]" onSubmit={handleCreate}>
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
                placeholder="Task title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <select
                className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value, assignedTo: '' })}
                required
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
            </div>
            <textarea
              className="min-h-[140px] rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="date"
                className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
              <select
                className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                required
                disabled={!selectedProject?.members?.length}
              >
                <option value="">Assign to project member</option>
                {selectedProject?.members?.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} · {member.email}
                  </option>
                ))}
              </select>
              <button
                className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-500"
                type="submit"
                disabled={saving || !form.projectId || !form.assignedTo}
              >
                {saving ? 'Saving…' : 'Create Task'}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-700">Task summary</p>
            <p className="mt-3 text-sm text-slate-600">Pick a project first to unlock assignment to valid members.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Project</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{selectedProject?.name || 'No project selected'}</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Available members</p>
                <p className="mt-2 text-sm text-slate-900">{selectedProject?.members?.length ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Status note</p>
                <p className="mt-2 text-sm text-slate-600">
                  Tasks can be updated immediately after creating. Use the status buttons on each card to keep progress current.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700 shadow-sm">{error}</div>}

      <div className="grid gap-6">
        {tasks.length === 0 && !loading ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
            No tasks found.
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
            No tasks match your current filters.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const statusStyles = {
              Pending: 'bg-amber-100 text-amber-700',
              'In Progress': 'bg-sky-100 text-sky-700',
              Done: 'bg-emerald-100 text-emerald-700'
            }
            const isOverdue = task.status !== 'Done' && new Date(task.dueDate) < new Date()
            return (
              <div key={task._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{task.title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{task.project?.name || 'Project missing'}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[task.status]}`}>
                      {task.status}
                    </span>
                    <p className={`text-sm ${isOverdue ? 'text-rose-600' : 'text-slate-500'}`}>
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">{task.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span>Assigned to: {task.assignedTo?.name ?? 'N/A'}</span>
                  <span>·</span>
                  <span>{task.assignedTo?.email ?? 'unknown'}</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Pending', 'In Progress', 'Done'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${task.status === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                      onClick={() => handleStatusChange(task._id, status)}
                      disabled={saving}
                    >
                      {saving && task.status !== status ? 'Saving…' : status}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
                    onClick={() => handleDelete(task._id)}
                    disabled={saving}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Tasks

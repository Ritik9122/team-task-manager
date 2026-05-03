import { useEffect, useState } from 'react'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getUsers
} from '../api'

function Projects({ user }) {
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const [selectedMember, setSelectedMember] = useState({})
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await getProjects()
      setProjects(response.data.projects)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load projects')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await getUsers()
      setUsers(response.data.users)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users')
    }
  }

  useEffect(() => {
    fetchProjects()
    if (user.role === 'admin') {
      fetchUsers()
    }
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await createProject(newProject)
      setProjects([response.data.project, ...projects])
      setNewProject({ name: '', description: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create project')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (projectId) => {
    setSaving(true)
    try {
      await deleteProject(projectId)
      setProjects(projects.filter((project) => project._id !== projectId))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete project')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (project) => {
    const name = window.prompt('Update project name', project.name)
    const description = window.prompt('Update project description', project.description)

    if (!name || !description) {
      return
    }

    try {
      await updateProject(project._id, { name, description })
      fetchProjects()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update project')
    }
  }

  const handleAddMember = async (projectId) => {
    try {
      const memberId = selectedMember[projectId]
      if (!memberId) {
        setError('Please select a member before adding')
        return
      }

      await addProjectMember(projectId, { memberId })
      fetchProjects()
      setSelectedMember((prev) => ({ ...prev, [projectId]: '' }))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add member')
    }
  }

  const handleRemoveMember = async (projectId, memberId) => {
    try {
      await removeProjectMember(projectId, memberId)
      fetchProjects()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to remove member')
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase()) || project.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
            <p className="mt-2 text-sm text-slate-600">Create, manage, and collaborate on your team projects.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
              placeholder="Search projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {user.role === 'admin' && (
              <button
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
                onClick={() => fetchProjects()}
                disabled={loading || saving}
              >
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
            )}
          </div>
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Create a new project</h2>
          <form className="mt-5 grid gap-4 lg:grid-cols-3" onSubmit={handleCreate}>
            <input
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              required
            />
            <input
              className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
              placeholder="Project description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              required
            />
            <button
              className="rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-500"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Create Project'}
            </button>
          </form>
        </div>
      )}

      {error && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700 shadow-sm">{error}</div>}
      {loading && <div className="rounded-3xl bg-slate-50 p-4 text-slate-600 shadow-sm">Loading projects…</div>}

      <div className="grid gap-6 xl:grid-cols-2">
        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
            No projects matched your search.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">{project.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">Members: {project.members.length}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.role === 'admin' && (
                    <button
                      className="rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-400"
                      onClick={() => handleUpdate(project)}
                    >
                      Edit
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button
                      className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {project.members.slice(0, 4).map((member) => (
                      <span key={member._id} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                        {member.name}
                      </span>
                    ))}
                    {project.members.length > 4 && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                        +{project.members.length - 4} more
                      </span>
                    )}
                    {project.members.length === 0 && <span className="text-sm text-slate-500">No members yet</span>}
                  </div>
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-900">Project members</p>
                  <div className="mt-4 grid gap-3">
                    {project.members.length === 0 && (
                      <p className="text-sm text-slate-500">Add the first member to this project.</p>
                    )}
                    {project.members.map((member) => (
                      <div key={member._id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.email}</p>
                        </div>
                        <button
                          className="rounded-2xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                          onClick={() => handleRemoveMember(project._id, member._id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                      className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-sky-500 focus:outline-none"
                      value={selectedMember[project._id] || ''}
                      onChange={(e) => setSelectedMember((prev) => ({ ...prev, [project._id]: e.target.value }))}
                    >
                      <option value="">Select a user to invite</option>
                      {users.map((userItem) => (
                        <option key={userItem._id} value={userItem._id}>
                          {userItem.name} · {userItem.email}
                        </option>
                      ))}
                    </select>
                    <button
                      className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                      onClick={() => handleAddMember(project._id)}
                    >
                      Add member
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Projects

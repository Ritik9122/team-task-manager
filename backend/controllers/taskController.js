const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, projectId } = req.body;
    const createdBy = req.user.userId;
    const userRole = req.user.role;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const projectMemberIds = project.members.map((member) => member.toString())

    // Check if user has access to create tasks in this project
    if (userRole !== 'admin' && !projectMemberIds.includes(createdBy)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if assigned user exists and is a member of the project
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    if (!projectMemberIds.includes(assignedTo)) {
      return res.status(400).json({ message: 'Assigned user must be a member of the project' });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      assignedTo,
      project: projectId,
      createdBy
    });

    await task.save();

    // Populate references
    await task.populate('assignedTo', 'name email');
    await task.populate('project', 'name');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { projectId, status } = req.query;

    let filter = {};

    if (projectId) {
      filter.project = projectId;
    }

    if (status) {
      filter.status = status;
    }

    if (userRole === 'admin') {
      // Admins can see all tasks
      const tasks = await Task.find(filter)
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      return res.json({ tasks });
    } else {
      // Members can only see tasks assigned to them or in projects they're members of
      const userProjects = await Project.find({ members: userId }).select('_id');
      const projectIds = userProjects.map(p => p._id);

      filter.$or = [
        { assignedTo: userId },
        { project: { $in: projectIds } }
      ];

      const tasks = await Task.find(filter)
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });

      return res.json({ tasks });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const task = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    const project = await Project.findById(task.project);
    const projectMemberIds = project.members.map((member) => member.toString())

    if (userRole !== 'admin' &&
        task.assignedTo._id.toString() !== userId &&
        !projectMemberIds.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, assignedTo } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    const project = await Project.findById(task.project);
    const isAssignedToTask = task.assignedTo.toString() === userId;
    const projectMemberIds = project.members.map((member) => member.toString())
    const isProjectMember = projectMemberIds.includes(userId);

    // Members can only update status of tasks assigned to them
    if (userRole === 'member') {
      if (!isAssignedToTask) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // Members can only update status
      if (title || description || dueDate || assignedTo) {
        return res.status(403).json({ message: 'Members can only update task status' });
      }
    }

    // Admins can update everything
    if (userRole === 'admin') {
      if (assignedTo) {
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
          return res.status(404).json({ message: 'Assigned user not found' });
        }
        if (!projectMemberIds.includes(assignedTo)) {
          return res.status(400).json({ message: 'Assigned user must be a member of the project' });
        }
      }
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();

    // Populate references
    await task.populate('assignedTo', 'name email');
    await task.populate('project', 'name');
    await task.populate('createdBy', 'name email');

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only admin or task creator can delete
    if (userRole !== 'admin' && task.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let filter = {};

    if (userRole === 'member') {
      // Members can only see their own tasks
      filter.assignedTo = userId;
    }

    const totalTasks = await Task.countDocuments(filter);
    const completedTasks = await Task.countDocuments({ ...filter, status: 'Done' });
    const pendingTasks = await Task.countDocuments({ ...filter, status: 'Pending' });
    const inProgressTasks = await Task.countDocuments({ ...filter, status: 'In Progress' });

    // Calculate overdue tasks
    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      ...filter,
      status: { $ne: 'Done' },
      dueDate: { $lt: now }
    });

    res.json({
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats
};
const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const createdBy = req.user.userId;

    // Validate members exist
    if (members && members.length > 0) {
      const existingMembers = await User.find({ _id: { $in: members } });
      if (existingMembers.length !== members.length) {
        return res.status(400).json({ message: 'Some members do not exist' });
      }
    }

    const project = new Project({
      name,
      description,
      members: members || [],
      createdBy
    });

    await project.save();

    // Populate members and createdBy
    await project.populate('members', 'name email');
    await project.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let projects;

    if (userRole === 'admin') {
      // Admins can see all projects
      projects = await Project.find()
        .populate('members', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Members can only see projects they're assigned to
      projects = await Project.find({ members: userId })
        .populate('members', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const project = await Project.findById(id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const projectMemberIds = project.members.map((member) => member._id?.toString?.() || member.toString())

    // Check if user has access to this project
    if (userRole !== 'admin' && !projectMemberIds.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, members } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only admin or project creator can update
    if (userRole !== 'admin' && project.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Validate members exist if provided
    if (members && members.length > 0) {
      const existingMembers = await User.find({ _id: { $in: members } });
      if (existingMembers.length !== members.length) {
        return res.status(400).json({ message: 'Some members do not exist' });
      }
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.members = members || project.members;

    await project.save();

    // Populate members and createdBy
    await project.populate('members', 'name email');
    await project.populate('createdBy', 'name email');

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only admin or project creator can delete
    if (userRole !== 'admin' && project.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Project.findByIdAndDelete(id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;
    const userRole = req.user.role;

    // Only admin can add members
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const projectMemberIds = project.members.map((member) => member.toString())
    if (projectMemberIds.includes(memberId)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    project.members.push(memberId);
    await project.save();

    await project.populate('members', 'name email');

    res.json({
      message: 'Member added successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userRole = req.user.role;

    // Only admin can remove members
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.members = project.members.filter(member => member.toString() !== memberId);
    await project.save();

    await project.populate('members', 'name email');

    res.json({
      message: 'Member removed successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
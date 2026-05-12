const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const projectSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  owner: { select: { id: true, name: true, email: true } },
  _count: { select: { members: true, tasks: true } },
};

const getProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;

    // Admins see all projects, members see their own
    let whereClause = {};
    if (req.user.role !== 'ADMIN') {
      whereClause = {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      };
    }

    if (status) {
      whereClause.status = status;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      select: {
        ...projectSelect,
        tasks: {
          select: { id: true, status: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const userId = req.user.id;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status: status || 'ACTIVE',
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      select: {
        ...projectSelect,
        tasks: { select: { id: true, status: true } },
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        ...projectSelect,
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
            assignee: { select: { id: true, name: true, email: true } },
            creator: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        members: {
          select: {
            id: true,
            role: true,
            joinedAt: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check access for non-admins
    if (req.user.role !== 'ADMIN') {
      const isMember = project.members.some((m) => m.user.id === req.user.id);
      if (!isMember && project.ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner or admin can update
    if (req.user.role !== 'ADMIN' && project.ownerId !== req.user.id) {
      const member = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: id, userId: req.user.id } },
      });
      if (!member || member.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
      select: {
        ...projectSelect,
        tasks: { select: { id: true, status: true } },
      },
    });

    res.json({ project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner or global admin can delete
    if (req.user.role !== 'ADMIN' && project.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the project owner can delete this project' });
    }

    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: id, userId } },
    });
    if (existing) {
      return res.status(409).json({ error: 'User is already a member' });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId,
        role: role || 'MEMBER',
      },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ member });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Cannot remove the owner
    if (project.ownerId === userId) {
      return res.status(400).json({ error: 'Cannot remove the project owner' });
    }

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: id, userId } },
    });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId: id, userId } },
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

const getMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId: id },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { joinedAt: 'asc' },
    });

    res.json({ members });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getMembers,
};

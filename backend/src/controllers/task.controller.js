const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
  projectId: true,
  project: { select: { id: true, name: true } },
  assigneeId: true,
  assignee: { select: { id: true, name: true, email: true } },
  creatorId: true,
  creator: { select: { id: true, name: true, email: true } },
};

const getTasks = async (req, res) => {
  try {
    const { projectId, status, priority, assigneeId, search } = req.query;
    const userId = req.user.id;

    let whereClause = {};

    // Non-admins only see tasks in their projects
    if (req.user.role !== 'ADMIN') {
      whereClause.project = {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      };
    }

    if (projectId) whereClause.projectId = projectId;
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (assigneeId) whereClause.assigneeId = assigneeId;
    if (search) {
      whereClause.title = { contains: search, mode: 'insensitive' };
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      select: taskSelect,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body;
    const userId = req.user.id;

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (req.user.role !== 'ADMIN') {
      const member = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
      });
      if (!member) {
        return res.status(403).json({ error: 'Not a member of this project' });
      }
    }

    // Verify assignee is a project member if provided
    if (assigneeId) {
      const assigneeMember = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: assigneeId } },
      });
      if (!assigneeMember && req.user.role !== 'ADMIN') {
        return res.status(400).json({ error: 'Assignee must be a project member' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
        creatorId: userId,
      },
      select: taskSelect,
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      select: taskSelect,
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check access
    if (req.user.role !== 'ADMIN') {
      const member = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId: req.user.id } },
      });
      if (!member) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check access
    if (req.user.role !== 'ADMIN') {
      const member = await prisma.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId: req.user.id } },
      });
      if (!member) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
      },
      select: taskSelect,
    });

    res.json({ task: updated });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only creator, project owner, or admin can delete
    if (req.user.role !== 'ADMIN' && task.creatorId !== req.user.id) {
      const project = await prisma.project.findUnique({ where: { id: task.projectId } });
      if (project.ownerId !== req.user.id) {
        const member = await prisma.projectMember.findUnique({
          where: { projectId_userId: { projectId: task.projectId, userId: req.user.id } },
        });
        if (!member || member.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Insufficient permissions to delete this task' });
        }
      }
    }

    await prisma.task.delete({ where: { id } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = { getTasks, createTask, getTask, updateTask, deleteTask };

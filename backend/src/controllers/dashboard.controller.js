const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    let projectWhere = {};
    let taskWhere = {};

    if (req.user.role !== 'ADMIN') {
      projectWhere = {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      };
      taskWhere = {
        project: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
      };
    }

    const [
      totalProjects,
      activeProjects,
      totalTasks,
      myTasks,
      overdueTasks,
      tasksByStatus,
      recentTasks,
      completedToday,
    ] = await Promise.all([
      prisma.project.count({ where: projectWhere }),
      prisma.project.count({ where: { ...projectWhere, status: 'ACTIVE' } }),
      prisma.task.count({ where: taskWhere }),
      prisma.task.count({ where: { ...taskWhere, assigneeId: userId } }),
      prisma.task.count({
        where: {
          ...taskWhere,
          dueDate: { lt: now },
          status: { not: 'DONE' },
        },
      }),
      prisma.task.groupBy({
        by: ['status'],
        where: taskWhere,
        _count: { status: true },
      }),
      prisma.task.findMany({
        where: taskWhere,
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          project: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 8,
      }),
      prisma.task.count({
        where: {
          ...taskWhere,
          status: 'DONE',
          updatedAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          },
        },
      }),
    ]);

    const statusMap = {};
    tasksByStatus.forEach((item) => {
      statusMap[item.status] = item._count.status;
    });

    res.json({
      stats: {
        totalProjects,
        activeProjects,
        totalTasks,
        myTasks,
        overdueTasks,
        completedToday,
        tasksByStatus: {
          TODO: statusMap['TODO'] || 0,
          IN_PROGRESS: statusMap['IN_PROGRESS'] || 0,
          IN_REVIEW: statusMap['IN_REVIEW'] || 0,
          DONE: statusMap['DONE'] || 0,
        },
      },
      recentTasks,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

module.exports = { getStats };

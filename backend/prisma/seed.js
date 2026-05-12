const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskmanager.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@taskmanager.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular users
  const userPassword = await bcrypt.hash('user123', 12);
  const alice = await prisma.user.upsert({
    where: { email: 'alice@taskmanager.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'alice@taskmanager.com',
      password: userPassword,
      role: 'MEMBER',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@taskmanager.com' },
    update: {},
    create: {
      name: 'Bob Smith',
      email: 'bob@taskmanager.com',
      password: userPassword,
      role: 'MEMBER',
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: 'carol@taskmanager.com' },
    update: {},
    create: {
      name: 'Carol Williams',
      email: 'carol@taskmanager.com',
      password: userPassword,
      role: 'MEMBER',
    },
  });

  // Create projects
  const project1 = await prisma.project.upsert({
    where: { id: 'project-1' },
    update: {},
    create: {
      id: 'project-1',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design',
      status: 'ACTIVE',
      ownerId: admin.id,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 'project-2' },
    update: {},
    create: {
      id: 'project-2',
      name: 'Mobile App Development',
      description: 'Build a cross-platform mobile application',
      status: 'ACTIVE',
      ownerId: alice.id,
    },
  });

  const project3 = await prisma.project.upsert({
    where: { id: 'project-3' },
    update: {},
    create: {
      id: 'project-3',
      name: 'API Integration',
      description: 'Integrate third-party APIs for payment and notifications',
      status: 'COMPLETED',
      ownerId: admin.id,
    },
  });

  // Add members to projects
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project1.id, userId: admin.id } },
    update: {},
    create: { projectId: project1.id, userId: admin.id, role: 'ADMIN' },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project1.id, userId: alice.id } },
    update: {},
    create: { projectId: project1.id, userId: alice.id, role: 'MEMBER' },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project1.id, userId: bob.id } },
    update: {},
    create: { projectId: project1.id, userId: bob.id, role: 'MEMBER' },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project2.id, userId: alice.id } },
    update: {},
    create: { projectId: project2.id, userId: alice.id, role: 'ADMIN' },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project2.id, userId: carol.id } },
    update: {},
    create: { projectId: project2.id, userId: carol.id, role: 'MEMBER' },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project3.id, userId: admin.id } },
    update: {},
    create: { projectId: project3.id, userId: admin.id, role: 'ADMIN' },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project3.id, userId: bob.id } },
    update: {},
    create: { projectId: project3.id, userId: bob.id, role: 'MEMBER' },
  });

  // Create tasks
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  await prisma.task.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Design new homepage mockup',
        description: 'Create wireframes and high-fidelity mockups for the new homepage',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: nextWeek,
        projectId: project1.id,
        assigneeId: alice.id,
        creatorId: admin.id,
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: nextWeek,
        projectId: project1.id,
        assigneeId: bob.id,
        creatorId: admin.id,
      },
      {
        title: 'Write content for About page',
        description: 'Draft and review content for the About Us page',
        status: 'TODO',
        priority: 'LOW',
        dueDate: nextWeek,
        projectId: project1.id,
        assigneeId: null,
        creatorId: admin.id,
      },
      {
        title: 'Fix navigation bug on mobile',
        description: 'The hamburger menu does not close after selecting an item',
        status: 'IN_REVIEW',
        priority: 'URGENT',
        dueDate: tomorrow,
        projectId: project1.id,
        assigneeId: alice.id,
        creatorId: bob.id,
      },
      {
        title: 'Implement user authentication',
        description: 'Add login, register, and JWT token management',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: yesterday,
        projectId: project2.id,
        assigneeId: alice.id,
        creatorId: alice.id,
      },
      {
        title: 'Design app icon and splash screen',
        description: 'Create app icon in all required sizes and splash screen',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: nextWeek,
        projectId: project2.id,
        assigneeId: carol.id,
        creatorId: alice.id,
      },
      {
        title: 'Integrate Stripe payment',
        description: 'Add Stripe payment gateway for subscription management',
        status: 'DONE',
        priority: 'HIGH',
        dueDate: yesterday,
        projectId: project3.id,
        assigneeId: bob.id,
        creatorId: admin.id,
      },
      {
        title: 'Set up push notifications',
        description: 'Integrate Firebase Cloud Messaging for push notifications',
        status: 'DONE',
        priority: 'MEDIUM',
        dueDate: yesterday,
        projectId: project3.id,
        assigneeId: admin.id,
        creatorId: admin.id,
      },
      {
        title: 'Overdue task example',
        description: 'This task is past its due date',
        status: 'TODO',
        priority: 'URGENT',
        dueDate: yesterday,
        projectId: project1.id,
        assigneeId: bob.id,
        creatorId: admin.id,
      },
    ],
  });

  console.log('Seeding complete!');
  console.log('Admin: admin@taskmanager.com / admin123');
  console.log('Alice: alice@taskmanager.com / user123');
  console.log('Bob: bob@taskmanager.com / user123');
  console.log('Carol: carol@taskmanager.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

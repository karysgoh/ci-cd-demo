import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Ensure SEED_DISABLE defaults to "0" when not set (cross-platform)
process.env.SEED_DISABLE = process.env.SEED_DISABLE ?? "0";

const prisma = new PrismaClient();
async function main() {
    if (process.env.SEED_DISABLE === '1') {
        console.log('Seeding disabled via SEED_DISABLE=1');
        return;
    }
    console.log('Starting database seeding...');

    // Create roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: { name: 'admin' }
    });

    const userRole = await prisma.role.upsert({
        where: { name: 'user' },
        update: {},
        create: { name: 'user' }
    });
    console.log('Roles created:', { adminRole, userRole });

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
        email: 'admin@example.com',
        passwordHash: adminPasswordHash,
        profile: {
            create: {
                fullName: 'Admin One'
            }
    },
    roles: {
        create: [
            { roleId: adminRole.id },
            { roleId: userRole.id }
        ]
    }
    },
    include: {
        profile: true,
        roles: { include: { role: true } }
    }
    });

    // Create regular user
    const userPasswordHash = await bcrypt.hash('user123', 10);
    const regularUser = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
        email: 'user@example.com',
        passwordHash: userPasswordHash,
        profile: {
        create: {
            fullName: 'Regular User'
        }
    },
    roles: {
        create: { roleId: userRole.id }
    }
    },
    include: {
        profile: true,
        roles: { include: { role: true } }
    }
    });
    console.log('Users created:', { adminUser, regularUser });

    // Create sample tasks
    const tasks = await Promise.all([
    prisma.task.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: 'Setup CI/CD Pipeline',
            description: 'Configure GitHub Actions for automated testing and deployment',
            priority: 3, // high priority
            assignedToId: adminUser.id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            // 7 days from now
        }
    }),
    prisma.task.upsert({
        where: { id: 2 },
        update: {},
        create: {
            title: 'Write E2E Tests',
            description: 'Implement comprehensive Playwright tests',
            priority: 3, // high priority
            assignedToId: regularUser.id
        }
    }),
    prisma.task.upsert({
        where: { id: 3 },
        update: {},
        create: {
            title: 'Code Review Process',
            description: 'Establish code review guidelines and process',
            priority: 2, // medium priority
            done: true
        }
    }),
    prisma.task.upsert({
        where: { id: 4 },
        update: {},
        create: {
            title: 'Database Optimization',
            description: 'Optimize database queries and add proper indexes',
            priority: 1, // low priority
        }
    }),
    prisma.task.upsert({
        where: { id: 5 },
        update: {},
        create: {
        title: 'Security Audit',
            description: 'Perform security audit and fix vulnerabilities',
            priority: 3, // high priority
            assignedToId: adminUser.id
        }
    })
    ]);
    console.log('Tasks created:', tasks);
    console.log('Database seeding completed successfully!');
    }
    main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
});
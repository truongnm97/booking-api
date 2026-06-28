import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function createUserIfNotExists(data: {
  email: string;
  hash: string;
  firstName: string;
  lastName: string;
  role: Role;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (!existing) {
    await prisma.user.create({ data });
    console.log(`Created ${data.email}`);
  } else {
    console.log(`Skipped ${data.email} (already exists)`);
  }
}

async function main() {
  const password = await argon2.hash('123456');

  await createUserIfNotExists({
    email: 'admin@gmail.com',
    hash: password,
    firstName: 'Admin',
    lastName: 'User',
    role: Role.ADMIN,
  });

  await createUserIfNotExists({
    email: 'hr1@gmail.com',
    hash: password,
    firstName: 'HR',
    lastName: 'One',
    role: Role.USER,
  });

  await createUserIfNotExists({
    email: 'hr2@gmail.com',
    hash: password,
    firstName: 'HR',
    lastName: 'Two',
    role: Role.USER,
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

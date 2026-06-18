import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient, TransactionType } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const name = process.env.SEED_USER_NAME ?? 'Admin User';
  const email = process.env.SEED_USER_EMAIL ?? 'admin@corporate-finance.com';
  const password = process.env.SEED_USER_PASSWORD ?? 'Admin@123';

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { name, email, passwordHash },
  });

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  const salaryCategory = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'Salaries',
      description: 'Employee payroll',
    },
  });

  const marketingCategory = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'Marketing',
      description: 'Advertising and campaigns',
    },
  });

  const rentCategory = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'Office Rent',
      description: 'Monthly office lease',
    },
  });

  const salesCategory = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'Sales Revenue',
      description: 'Product and service sales',
    },
  });

  const investmentCategory = await prisma.category.create({
    data: {
      userId: user.id,
      name: 'Investments',
      description: 'Investment returns',
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        categoryId: salesCategory.id,
        description: 'Q1 product sales',
        amount: 85000,
        transactionDate: new Date('2024-03-31'),
        type: TransactionType.INCOME,
      },
      {
        userId: user.id,
        categoryId: investmentCategory.id,
        description: 'Bond interest',
        amount: 3500,
        transactionDate: new Date('2024-03-15'),
        type: TransactionType.INCOME,
      },
      {
        userId: user.id,
        categoryId: salaryCategory.id,
        description: 'March payroll',
        amount: 42000,
        transactionDate: new Date('2024-03-28'),
        type: TransactionType.EXPENSE,
      },
      {
        userId: user.id,
        categoryId: marketingCategory.id,
        description: 'Digital ads campaign',
        amount: 8500,
        transactionDate: new Date('2024-03-10'),
        type: TransactionType.EXPENSE,
      },
      {
        userId: user.id,
        categoryId: rentCategory.id,
        description: 'March office rent',
        amount: 12000,
        transactionDate: new Date('2024-03-05'),
        type: TransactionType.EXPENSE,
      },
    ],
  });

  console.log(`Seed completed for user: ${email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

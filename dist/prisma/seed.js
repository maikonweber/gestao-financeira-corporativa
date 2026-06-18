"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("../generated/prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
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
                type: client_1.TransactionType.INCOME,
            },
            {
                userId: user.id,
                categoryId: investmentCategory.id,
                description: 'Bond interest',
                amount: 3500,
                transactionDate: new Date('2024-03-15'),
                type: client_1.TransactionType.INCOME,
            },
            {
                userId: user.id,
                categoryId: salaryCategory.id,
                description: 'March payroll',
                amount: 42000,
                transactionDate: new Date('2024-03-28'),
                type: client_1.TransactionType.EXPENSE,
            },
            {
                userId: user.id,
                categoryId: marketingCategory.id,
                description: 'Digital ads campaign',
                amount: 8500,
                transactionDate: new Date('2024-03-10'),
                type: client_1.TransactionType.EXPENSE,
            },
            {
                userId: user.id,
                categoryId: rentCategory.id,
                description: 'March office rent',
                amount: 12000,
                transactionDate: new Date('2024-03-05'),
                type: client_1.TransactionType.EXPENSE,
            },
        ],
    });
    console.log(`Seed completed for user: ${email}`);
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
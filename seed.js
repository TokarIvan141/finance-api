require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Підключення до бази даних через Prisma Adapter...');

    await prisma.transactionDetail.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('Базу даних очищено!');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.create({
        data: {
            name: 'Іван',
            email: 'ivan.tokar@gmail.com',
            password: hashedPassword,
            categories: {
                create: [
                    { name: 'Зарплата', type: 'income', color: '#2ECC71' },
                    { name: 'Продукти', type: 'expense', color: '#E74C3C' },
                    { name: 'Комуналка', type: 'expense', color: '#3498DB' },
                    { name: 'Транспорт', type: 'expense', color: '#F1C40F' },
                    { name: 'Кафе', type: 'expense', color: '#9B59B6' }
                ]
            }
        },
        include: { categories: true }
    });

    const u1Cats = user1.categories;

    await prisma.budget.createMany({
        data: [
            { categoryId: u1Cats[1].id, amountLimit: 5000, userId: user1.id },
            { categoryId: u1Cats[4].id, amountLimit: 2000, userId: user1.id }
        ]
    });

    const user1Tx = [
        { cat: u1Cats[0].id, amount: 25000, type: 'income', date: '2026-05-01T10:00:00Z', desc: 'Аванс' },
        { cat: u1Cats[1].id, amount: 450.50, type: 'expense', date: '2026-05-02T12:30:00Z', desc: 'Сільпо' },
        { cat: u1Cats[1].id, amount: 120, type: 'expense', date: '2026-05-03T18:00:00Z', desc: 'Хліб та молоко' },
        { cat: u1Cats[3].id, amount: 300, type: 'expense', date: '2026-05-04T09:00:00Z', desc: 'Проїзний' },
        { cat: u1Cats[4].id, amount: 250, type: 'expense', date: '2026-05-05T15:00:00Z', desc: 'Кава' },
        { cat: u1Cats[2].id, amount: 1800, type: 'expense', date: '2026-05-06T11:00:00Z', desc: 'Опалення' },
        { cat: u1Cats[1].id, amount: 1200, type: 'expense', date: '2026-05-07T19:30:00Z', desc: 'АТБ закупка' },
        { cat: u1Cats[3].id, amount: 80, type: 'expense', date: '2026-05-08T08:15:00Z', desc: 'Таксі' },
        { cat: u1Cats[4].id, amount: 650, type: 'expense', date: '2026-05-09T20:00:00Z', desc: 'Піцерія' },
        { cat: u1Cats[1].id, amount: 320, type: 'expense', date: '2026-05-10T14:00:00Z', desc: 'Фрукти' }
    ];

    for (const tx of user1Tx) {
        await prisma.transaction.create({
            data: {
                userId: user1.id, categoryId: tx.cat, amount: tx.amount, type: tx.type, date: new Date(tx.date),
                detail: { create: { description: tx.desc } }
            }
        });
    }

    const user2 = await prisma.user.create({
        data: {
            name: 'Віталій',
            email: 'vitaliy.b@gmail.com',
            password: hashedPassword,
            categories: {
                create: [
                    { name: 'Фріланс', type: 'income', color: '#1ABC9C' },
                    { name: 'Продукти', type: 'expense', color: '#E74C3C' },
                    { name: 'Оренда', type: 'expense', color: '#E67E22' },
                    { name: 'Медицина', type: 'expense', color: '#34495E' },
                    { name: 'Розваги', type: 'expense', color: '#9B59B6' }
                ]
            }
        },
        include: { categories: true }
    });

    const u2Cats = user2.categories;

    await prisma.budget.create({
        data: { categoryId: u2Cats[4].id, amountLimit: 1500, userId: user2.id }
    });

    const user2Tx = [
        { cat: u2Cats[0].id, amount: 12000, type: 'income', date: '2026-05-01T14:00:00Z', desc: 'Сайт для клієнта' },
        { cat: u2Cats[2].id, amount: 8000, type: 'expense', date: '2026-05-01T16:00:00Z', desc: 'Оренда травень' },
        { cat: u2Cats[1].id, amount: 600, type: 'expense', date: '2026-05-02T11:00:00Z', desc: 'М`ясо та овочі' },
        { cat: u2Cats[3].id, amount: 1200, type: 'expense', date: '2026-05-03T10:00:00Z', desc: 'Аптека' },
        { cat: u2Cats[4].id, amount: 400, type: 'expense', date: '2026-05-04T21:00:00Z', desc: 'Кіно' },
        { cat: u2Cats[1].id, amount: 250, type: 'expense', date: '2026-05-05T13:00:00Z', desc: 'Дрібниці' },
        { cat: u2Cats[0].id, amount: 5000, type: 'income', date: '2026-05-06T18:00:00Z', desc: 'Правки по дизайну' },
        { cat: u2Cats[4].id, amount: 850, type: 'expense', date: '2026-05-07T22:00:00Z', desc: 'Боулінг' },
        { cat: u2Cats[1].id, amount: 430, type: 'expense', date: '2026-05-08T12:00:00Z', desc: 'Новус' },
        { cat: u2Cats[4].id, amount: 150, type: 'expense', date: '2026-05-09T17:00:00Z', desc: 'Снеки' }
    ];

    for (const tx of user2Tx) {
        await prisma.transaction.create({
            data: {
                userId: user2.id, categoryId: tx.cat, amount: tx.amount, type: tx.type, date: new Date(tx.date),
                detail: { create: { description: tx.desc } }
            }
        });
    }

    const user3 = await prisma.user.create({
        data: {
            name: 'Владислав',
            email: 'vlad.finance@gmail.com',
            password: hashedPassword,
            categories: {
                create: [
                    { name: 'Стипендія', type: 'income', color: '#2ECC71' },
                    { name: 'Продукти', type: 'expense', color: '#E74C3C' },
                    { name: 'Одяг', type: 'expense', color: '#1ABC9C' },
                    { name: 'Паливо', type: 'expense', color: '#F39C12' },
                    { name: 'Навчання', type: 'expense', color: '#3498DB' }
                ]
            }
        },
        include: { categories: true }
    });

    const u3Cats = user3.categories;

    const user3Tx = [
        { cat: u3Cats[0].id, amount: 3500, type: 'income', date: '2026-05-01T09:00:00Z', desc: 'Стипендія за травень' },
        { cat: u3Cats[3].id, amount: 1500, type: 'expense', date: '2026-05-02T10:30:00Z', desc: 'Заправка ОККО' },
        { cat: u3Cats[1].id, amount: 350, type: 'expense', date: '2026-05-02T15:00:00Z', desc: 'Перекус' },
        { cat: u3Cats[4].id, amount: 450, type: 'expense', date: '2026-05-03T12:00:00Z', desc: 'Курси Udemy' },
        { cat: u3Cats[2].id, amount: 2200, type: 'expense', date: '2026-05-04T16:00:00Z', desc: 'Кросівки' },
        { cat: u3Cats[1].id, amount: 500, type: 'expense', date: '2026-05-05T19:00:00Z', desc: 'Ашан' },
        { cat: u3Cats[3].id, amount: 800, type: 'expense', date: '2026-05-07T11:00:00Z', desc: 'Бензин додатково' },
        { cat: u3Cats[4].id, amount: 300, type: 'expense', date: '2026-05-08T14:20:00Z', desc: 'Канцтовари' },
        { cat: u3Cats[1].id, amount: 180, type: 'expense', date: '2026-05-09T10:00:00Z', desc: 'Кава' },
        { cat: u3Cats[1].id, amount: 640, type: 'expense', date: '2026-05-10T18:00:00Z', desc: 'Вечеря' }
    ];

    for (const tx of user3Tx) {
        await prisma.transaction.create({
            data: {
                userId: user3.id, categoryId: tx.cat, amount: tx.amount, type: tx.type, date: new Date(tx.date),
                detail: { create: { description: tx.desc } }
            }
        });
    }

    console.log('Сідіювання успішно завершено!');
}

main()
    .catch((e) => {
        console.error('Помилка під час сідіювання:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
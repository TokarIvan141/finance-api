require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const prisma = require('../src/shared/database/prisma');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await prisma.$disconnect();
});

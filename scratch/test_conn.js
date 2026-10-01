require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function test() {
  console.log('Testing DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 35) + '...');
  const prisma = new PrismaClient();
  try {
    const count = await prisma.user.count();
    console.log('Connection successful! User count:', count);
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();

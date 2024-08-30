import { PrismaClient } from '@prisma/client';// const { withAccelerate } = require('@prisma/extension-accelerate');

// const prisma = new PrismaClient().$extends(withAccelerate());
const prisma = new PrismaClient();

export default prisma;

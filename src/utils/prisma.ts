import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient
}

const globalPrisma = global as unknown as { prisma: PrismaClient}

if(process.env.NODE_ENV !== 'production') globalPrisma.prisma = prisma

export default prisma = globalPrisma.prisma || new PrismaClient({log:['query']})

/*let prisma: PrismaClient;

declare global {
  var prisma: PrismaClient; // This must be a `var` and not a `let / const`
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;*/
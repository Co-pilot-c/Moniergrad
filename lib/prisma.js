/**
 * lib/prisma.js
 * Singleton Prisma client — mencegah connection explosion di serverless.
 *
 * Di serverless, setiap cold start bisa membuat instance baru.
 * Dengan globalThis, instance di-reuse selama function container masih hidup.
 */
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    // Connection pool kecil — optimal untuk serverless
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Hanya cache di non-production agar hot-reload dev tidak leak
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;

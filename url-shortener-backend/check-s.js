const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const url = await prisma.url.findUnique({ where: { shortCode: 's' }});
  console.log('Does s exist?:', !!url);
  process.exit(0);
}
check();

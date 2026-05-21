import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const stores = await prisma.store.findMany();
  const items = await prisma.item.findMany();
  console.log("STORES:", stores);
  console.log("ITEMS:", items.map(i => ({id: i.id, name: i.name})).slice(0, 20));
}
main().catch(console.error).finally(() => prisma.$disconnect());

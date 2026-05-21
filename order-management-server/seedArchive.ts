import { PrismaClient } from '@prisma/client';
// @ts-ignore
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const stores = await prisma.store.findMany();
  const items = await prisma.item.findMany();

  if (stores.length === 0 || items.length === 0) {
    console.log("Please create some stores and items first.");
    return;
  }

  // Clear existing archive data
  await prisma.orderItemArchive.deleteMany();
  await prisma.orderArchive.deleteMany();

  const archiveOrders: any[] = [];
  const archiveItems: any[] = [];

  for (let i = 0; i < 50; i++) {
    const orderId = crypto.randomUUID();
    const store = stores[Math.floor(Math.random() * stores.length)];
    
    // Random date between 30 and 90 days ago
    const date = new Date();
    date.setDate(date.getDate() - (Math.floor(Math.random() * 60) + 30));
    
    const qty = Math.floor(Math.random() * 5) + 1;
    const item = items[Math.floor(Math.random() * items.length)];
    const total_amount = item.price * qty;

    archiveOrders.push({
      id: orderId,
      store_id: store.id,
      total_amount,
      status: 'COMPLETED',
      created_at: date,
      archived_at: new Date(),
    });

    archiveItems.push({
      id: crypto.randomUUID(),
      item_id: item.id,
      qty,
      orderArchiveId: orderId,
    });
  }

  await prisma.orderArchive.createMany({
    data: archiveOrders,
  });

  await prisma.orderItemArchive.createMany({
    data: archiveItems,
  });

  console.log("Seeded 50 archived orders.");
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

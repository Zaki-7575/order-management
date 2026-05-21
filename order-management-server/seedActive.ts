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

  // Clear existing ACTIVE data that might be corrupted with fake strings like 'store_1'
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  const activeOrders: any[] = [];
  const activeItems: any[] = [];

  for (let i = 0; i < 30; i++) {
    const orderId = crypto.randomUUID();
    const store = stores[Math.floor(Math.random() * stores.length)];
    
    // Random date within the last 7 days for active orders
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    
    const qty = Math.floor(Math.random() * 3) + 1;
    const item = items[Math.floor(Math.random() * items.length)];
    const total_amount = item.price * qty;

    activeOrders.push({
      id: orderId,
      store_id: store.id,
      total_amount,
      status: 'COMPLETED',
      created_at: date,
    });

    activeItems.push({
      id: crypto.randomUUID(),
      item_id: item.id,
      qty,
      orderId: orderId,
    });
  }

  await prisma.order.createMany({
    data: activeOrders,
  });

  await prisma.orderItem.createMany({
    data: activeItems,
  });

  console.log("Seeded 30 proper active orders with real relations.");
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

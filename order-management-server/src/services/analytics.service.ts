import prisma from "../config/prisma";

export const archiveOldOrdersService = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const oldOrders = await prisma.order.findMany({
    where: {
      created_at: {
        lt: thirtyDaysAgo,
      },
    },
    include: {
      items: true,
    },
  });

  if (oldOrders.length === 0) {
    return { count: 0 };
  }

  // Insert into archive tables
  for (const order of oldOrders) {
    await prisma.orderArchive.create({
      data: {
        id: order.id,
        store_id: order.store_id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        items: {
          create: order.items.map(item => ({
            id: item.id,
            item_id: item.item_id,
            qty: item.qty,
          })),
        },
      },
    });
  }

  // Delete from main tables
  const deleted = await prisma.order.deleteMany({
    where: {
      id: {
        in: oldOrders.map(o => o.id),
      },
    },
  });

  return { count: deleted.count };
};

export const getOrdersPerDayService = async (type: string = 'active') => {
  if (type === 'archived') {
    return await prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM "OrderArchive"
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
  }
  
  return await prisma.$queryRaw`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM "Order"
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `;
};

export const getRevenuePerStoreService = async (type: string = 'active') => {
  const model = type === 'archived' ? prisma.orderArchive : prisma.order;
  
  const result = await (model as any).groupBy({
    by: ['store_id'],
    _sum: {
      total_amount: true,
    },
    orderBy: {
      _sum: {
        total_amount: 'desc',
      },
    },
  });

  return result.map((item: any) => ({
    store_id: item.store_id,
    revenue: item._sum.total_amount,
  }));
};

export const getTopItemsService = async (type: string = 'active') => {
  const model = type === 'archived' ? prisma.orderItemArchive : prisma.orderItem;

  const result = await (model as any).groupBy({
    by: ['item_id'],
    _sum: {
      qty: true,
    },
    orderBy: {
      _sum: {
        qty: 'desc',
      },
    },
    take: 5,
  });

  return result.map((item: any) => ({
    item_id: item.item_id,
    total_qty: item._sum.qty,
  }));
};

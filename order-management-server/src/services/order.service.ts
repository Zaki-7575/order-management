import prisma from "../config/prisma";
import { CreateOrderInput } from "../validations/order.validation";
import { getIO } from "../config/socket";
export const createOrderService = async (
  data: CreateOrderInput
) => {
  const order = await prisma.order.create({
    data: {
      store_id: data.store_id,
      total_amount: data.total_amount,

      items: {
        create: data.items,
      },
    },

    include: {
      items: true,
    },
  });

  try {
    const io = getIO();
    io.to(`store_${order.store_id}`).emit("new_order", order);
    io.emit("new_order", order); // Also broadcast to everyone just in case
  } catch (error) {
    console.error("Socket emit new_order failed", error);
  }

  return order;
};

export const getOrdersService = async (
  store_id?: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const whereCondition = store_id
    ? {
        store_id,
      }
    : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: whereCondition,

      include: {
        items: true,
      },

      orderBy: {
        created_at: "desc",
      },

      skip,
      take: limit,
    }),

    prisma.order.count({
      where: whereCondition,
    }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateOrderStatusService = async (
  id: string,
  status: "PLACED" | "PREPARING" | "COMPLETED"
) => {
  const existingOrder = await prisma.order.findUnique({
    where: { id },
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id,
    },

    data: {
      status,
    },

    include: {
      items: true,
    },
  });

  try {
    const io = getIO();
    io.to(`store_${updatedOrder.store_id}`).emit("order_status_updated", updatedOrder);
    io.emit("order_status_updated", updatedOrder); // Also broadcast to everyone just in case
  } catch (error) {
    console.error("Socket emit order_status_updated failed", error);
  }

  return updatedOrder;
};
import { prisma } from "config/client";
import { Request, Response } from "express";

const getDashboardPage = async (req: Request, res: Response) => {
  try {
    const [users, orders, products] = await Promise.all([
      prisma.user.findMany(),
      prisma.order.findMany(),
      prisma.product.findMany(),
    ]);

    const totalUsers = users.length;
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const recentOrders = await prisma.order.findMany({
      include: {
        user: true,
      },
    });

    return res.status(200).json({
      data: {
        stats: { totalUsers, totalOrders, totalProducts },
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

export { getDashboardPage };

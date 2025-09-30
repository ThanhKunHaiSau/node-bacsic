import { prisma } from "config/client";
import { Request, Response } from "express";
import { getAllProductService } from "services/client/product.service";
import { getHomePageService } from "services/user.service";
import { promise } from "zod";

const products = [
  {
    _id: "1",
    name: "Laptop Dell XPS 13",
    price: 25000000,
    shortDesc: "Laptop siêu mỏng nhẹ",
    detailDesc: "Dell XPS 13, CPU i7, RAM 16GB, SSD 512GB",
    quantity: 10,
    factory: "Dell",
    target: "Văn phòng",
    image: "dell-xps-13.jpg",
  },
  {
    _id: "2",
    name: "MacBook Pro 14",
    price: 45000000,
    shortDesc: "MacBook cao cấp cho developer",
    detailDesc: "MacBook Pro 14 M1 Pro, RAM 16GB, SSD 1TB",
    quantity: 5,
    factory: "Apple",
    target: "Lập trình, Thiết kế",
    image: "macbook-pro-14.jpg",
  },
];
const getDashboardPage = async (req: Request, res: Response) => {
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
  return res.render("admin/dashboard/index.ejs", {
    stats: { totalUsers, totalOrders, totalProducts },
    recentOrders,
  });
};
const getAdminUserPage = async (req: Request, res: Response) => {
  let data = await getHomePageService();
  return res.render("admin/user/user.ejs", { data });
};
const getAdminProductPage = async (req: Request, res: Response) => {
  const products = await getAllProductService();
  return res.render("admin/product/product.ejs", { products });
};
const getAdminOrderPage = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
    },
  });

  return res.render("admin/order/order.ejs", { orders });
};
const getProductByCartId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const price = await prisma.order.findUnique({
    where: {
      id: +id,
    },
    select: {
      totalPrice: true,
    },
  });
  const order = await prisma.orderDetail.findMany({
    where: { orderId: +id },
    include: {
      product: true,
    },
  });

  return res.render("admin/order/order-detail.ejs", {
    order,
    totalPrice: price.totalPrice,
  });
};

export {
  getDashboardPage,
  getAdminUserPage,
  getAdminProductPage,
  getAdminOrderPage,
  getProductByCartId,
};

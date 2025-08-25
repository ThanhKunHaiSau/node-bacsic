import { Request, Response } from "express";
import { getHomePageService } from "services/user.service";

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
  return res.render("admin/dashboard/index.ejs");
};
const getAdminUserPage = async (req: Request, res: Response) => {
  let data = await getHomePageService();
  return res.render("admin/user/user.ejs", { data });
};
const getAdminProductPage = async (req: Request, res: Response) => {
  return res.render("admin/product/product.ejs", { products });
};
const getAdminOrderPage = async (req: Request, res: Response) => {
  return res.render("admin/order/order.ejs");
};

const getAdminCreateProduct = (req: Request, res: Response) => {
  return res.render("admin/product/create.ejs");
};
export {
  getDashboardPage,
  getAdminUserPage,
  getAdminProductPage,
  getAdminOrderPage,
  getAdminCreateProduct,
};

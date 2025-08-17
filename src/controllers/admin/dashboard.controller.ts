import { Request, Response } from "express";
import { getHomePageService } from "services/user.service";
const getDashboardPage = async (req: Request, res: Response) => {
  return res.render("admin/dashboard/index.ejs");
};
const getAdminUserPage = async (req: Request, res: Response) => {
  let data = await getHomePageService();
  return res.render("admin/user/user.ejs", { data });
};
const getAdminProductPage = async (req: Request, res: Response) => {
  return res.render("admin/product/product.ejs");
};
const getAdminOrderPage = async (req: Request, res: Response) => {
  return res.render("admin/order/order.ejs");
};

export {
  getDashboardPage,
  getAdminUserPage,
  getAdminProductPage,
  getAdminOrderPage,
};

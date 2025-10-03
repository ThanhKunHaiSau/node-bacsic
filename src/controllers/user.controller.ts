import { prisma } from "config/client";
import { Request, Response } from "express";
import { getAllProductService } from "services/client/product.service";
import {
  createUserService,
  deleteUserService,
  fillDataUser,
  getHomePageService,
  getRolesService,
  updateUserService,
} from "services/user.service";
const getHomePage = async (req: Request, res: Response) => {
  const currentPage = req.query.page ? Number(req.query.page) : 1;
  const perPage = req.query.limit ? Number(req.query.limit) : 8;
  const skip = (currentPage - 1) * perPage;
  const products = await getAllProductService({ limit: perPage, skip });
  const totalProducts = (await prisma.product.findMany()).length;
  const totalPages = Math.ceil(totalProducts / perPage);
  return res.render("client/home/home.ejs", {
    products,
    pagination: {
      page: currentPage,
      limit: perPage,
      total: totalProducts,
      totalPages,
    },
  });
};
const getCreateUser = async (req: Request, res: Response) => {
  const roles = await getRolesService();
  return res.render("admin/user/create", { roles });
};
const postCreateUser = async (req: Request, res: Response) => {
  const { fullname, username, address, phone, role, password } = req.body;
  const avatar = req.file?.filename ?? null;
  await createUserService({
    fullname,
    username,
    address,
    phone,
    role,
    avatar,
    password,
  });
  return res.redirect("/admin/user");
};
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteUserService(id);
  return res.redirect("/admin/user");
};
const editUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await fillDataUser(id);
  const roles = await getRolesService();
  return res.render("/admin/editUser", { user, roles });
};
const handleUpdateUser = async (req: Request, res: Response) => {
  const { id, username, fullName, address, phone, roleId, name } = req.body;
  const avatar = req.file?.filename ?? null;

  await updateUserService({
    id,
    name,
    username,
    fullName,
    address,
    phone,
    avatar,
    roleId,
  });
  return res.redirect("/");
};

export {
  getHomePage,
  getCreateUser,
  postCreateUser,
  deleteUser,
  editUser,
  handleUpdateUser,
};

import { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  fillDataUser,
  getHomePageService,
  updateUserService,
} from "services/user.service";
const getHomePage = async (req: Request, res: Response) => {
  let data = await getHomePageService();
  return res.render("home", { data });
};
const getCreateUser = (req: Request, res: Response) => {
  return res.render("createUser");
};
const postCreateUser = async (req: Request, res: Response) => {
  const { name, email, address } = req.body;
  await createUserService({ name, email, address });
  return res.redirect("/");
};
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteUserService(id);
  return res.redirect("/");
};
const editUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await fillDataUser(id);
  return res.render("editUser", { id, user });
};
const handleUpdateUser = async (req: Request, res: Response) => {
  const { id, name, email, address } = req.body;
  await updateUserService(id, { name, email, address });
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

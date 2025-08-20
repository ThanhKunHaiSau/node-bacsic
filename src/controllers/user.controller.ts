import { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  fillDataUser,
  getHomePageService,
  getRolesService,
  updateUserService,
} from "services/user.service";
const getHomePage = async (req: Request, res: Response) => {
  let data = await getHomePageService();
  return res.render("home", { data });
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
  return res.render("editUser", { user, roles });
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

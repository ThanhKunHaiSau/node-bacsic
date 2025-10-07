import { prisma } from "config/client";
import { Request, Response } from "express";
import { postRegisterService } from "services/client/auth.service";
import {
  TAuth,
  TRegister,
  TRegisterSchema,
} from "src/validation/auth.validate";
import { validateAuth } from "src/validation/handleValidate/login.validate";

const getLogin = (req: Request, res: Response) => {
  const errors = [];
  const oldData = {
    username: "",
    password: "",
  };
  const { session } = req as any;
  const message = session?.messages || [];
  if (message.length > 0) {
    errors.push(message);
  }
  return res.render("client/auth/login.ejs", { errors, oldData });
};
const register = (req: Request, res: Response) => {
  const errors = [];
  const oldData = {
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  return res.render("client/auth/register.ejs", { errors, oldData });
};
// const login = async (req: Request, res: Response) => {
//   console.log(req.body);
//   const errors = await validateAuth(req.body);
//   const { username, password } = req.body as TAuth;
//   const oldData = {
//     username,
//   };
//   if (errors.length > 0) {
//     return res.render("client/auth/login.ejs", { errors, oldData });
//   }
//   const data = await handleLoginService(username, password);
//   if (data.errors) {
//     return res.render("client/auth/login.ejs", {
//       errors: data.errors,
//       oldData,
//     });
//   }
//   return res.redirect("/");
// };
const postRegister = async (req: Request, res: Response) => {
  const errors = [];
  const { fullName, email, password, confirmPassword } = req.body as TRegister;
  const oldData = {
    fullName,
    email,
    password,
    confirmPassword,
  };
  const validate = await TRegisterSchema.safeParseAsync(req.body);
  if (!validate.success) {
    const errorZod = validate.error.issues;
    const errors = errorZod?.map((item) => `${item.message} (${item.path[0]})`);
    return res.render("client/auth/register.ejs", {
      errors,
      oldData,
    });
  }
  const params = { fullName, email, password };
  await postRegisterService(params);
  return res.render("client/auth/login.ejs", { errors, oldData });
};
const getSucucessLogin = (req: Request, res: Response) => {
  const { user } = req as any;
  switch (user?.role?.name) {
    case "ADMIN":
      res.redirect("/admin");
      return;

    case "USER":
      res.redirect("/");
      return;

    default:
      res.redirect("/login");
      return;
  }
};
const getNotHavePermission = (req: Request, res: Response) => {
  return res.render("/status/403.ejs");
};
export {
  getLogin,
  register,
  postRegister,
  getSucucessLogin,
  getNotHavePermission,
};

import { Request, Response } from "express";
const getHomePage = (req: Request, res: Response) => {
  return res.render("home");
};
const getCreateUser = (req: Request, res: Response) => {
  return res.render("createUser");
};
export { getHomePage, getCreateUser };

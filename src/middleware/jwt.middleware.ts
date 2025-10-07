import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  const whiteList = ["/login"];
  const isWhiteList = whiteList.some((route) => route === path);
  console.log("fafafafa", isWhiteList, path);
  if (isWhiteList) {
    next();
    return;
  }
  try {
    const token = req.headers.token as string;
    const datadecod = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username, fullname, roleId, accountType, avatar, role } =
      datadecod as any;
    req.user = {
      id,
      username,
      password: "",
      phone: "",
      address: "",
      fullName: fullname,
      roleId: roleId,
      accountType,
      avatar,
      role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      data: null,
      message: "Toke invalid or is expire!",
    });
  }
};
export { checkValidJWT };

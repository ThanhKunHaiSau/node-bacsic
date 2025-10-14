import { NextFunction, Request, Response } from "express";

const verifyRoleAdmin = (req: Request, res: Response, next: NextFunction) => {
  const roles = req?.user.role?.name;
  console.log("roledadads", roles);

  if (roles !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You do not have permission to access this resource" });
  }
  next();
};
export { verifyRoleAdmin };

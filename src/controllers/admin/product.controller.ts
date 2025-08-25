import { Request, Response } from "express";

const handleCreateProduct = (req: Request, res: Response) => {
  return res.render("/admin/product");
};
export { handleCreateProduct };

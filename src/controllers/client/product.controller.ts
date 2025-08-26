import { prisma } from "config/client";
import { Request, Response } from "express";
import { getProdcutById } from "services/client/product.service";
const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProdcutById(id);
  return res.render("client/product/detail.ejs", { product });
};
export { getProductPage };

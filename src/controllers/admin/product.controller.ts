import { prisma } from "config/client";
import { Request, Response } from "express";
import { ProductSchema, TProduct } from "src/validation/product.schema";
const getAdminCreateProduct = (req: Request, res: Response) => {
  const errors = [];
  const oldData = {
    name: "",
    price: "",
    detailDesc: "",
    shortDesc: "",
    quantity: "",
    factory: "",
    target: "",
  };
  return res.render("admin/product/create.ejs", { errors, oldData });
};
const handleCreateProduct = (req: Request, res: Response) => {
  const { name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body as TProduct;
  console.log(req.body);
  try {
    const validate = ProductSchema.safeParse(req.body);
    if (!validate.success) {
      const errorsZod = validate.error.issues;
      const errors = errorsZod?.map(
        (item) => `${item.message} (${item.path[0]})`
      );
      const oldData = {
        name,
        price,
        detailDesc,
        shortDesc,
        quantity,
        factory,
        target,
      };

      return res.render("admin/product/create.ejs", { errors, oldData });
    }
  } catch (error) {
    console.log(error);
  }
};
export { handleCreateProduct, getAdminCreateProduct };

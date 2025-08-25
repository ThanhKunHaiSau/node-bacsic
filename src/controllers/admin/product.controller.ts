import { prisma } from "config/client";
import { Request, Response } from "express";
import {
  getAllProductService,
  handleCreateProductService,
} from "services/product.service";
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
const handleCreateProduct = async (req: Request, res: Response) => {
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
    const image = req.file?.filename ?? null;
    const params = {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      image,
    };
    await handleCreateProductService(params);
    const products = await getAllProductService();
    return res.render("admin/product/product.ejs", { products });
  } catch (error) {
    console.log(error);
  }
};
export { handleCreateProduct, getAdminCreateProduct };

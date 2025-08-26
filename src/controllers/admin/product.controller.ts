import { prisma } from "config/client";
import { Request, Response } from "express";
import {
  getAllProductService,
  getProdcutById,
  handleCreateProductService,
  updateProductService,
} from "services/product.service";
import {
  ProductSchema,
  TProduct,
  TProductUpdate,
  UpdateProductSchema,
} from "src/validation/product.schema";

const factoryOptions = [
  { name: "Apple (MacBook)", value: "APPLE" },
  { name: "Asus", value: "ASUS" },
  { name: "Lenovo", value: "LENOVO" },
  { name: "Dell", value: "DELL" },
  { name: "LG", value: "LG" },
  { name: "Acer", value: "ACER" },
];

const targetOptions = [
  { name: "Gaming", value: "GAMING" },
  { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
  { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
  { name: "Mỏng nhẹ", value: "MONG-NHE" },
  { name: "Doanh nhân", value: "DOANH-NHAN" },
];
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

const handleDeleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  await prisma.product.delete({ where: { id: +id } });
  const products = await getAllProductService();
  return res.render("admin/product/product.ejs", { products });
};
const handleGetUpdateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const errors = [];
  const product = await getProdcutById(id);
  return res.render("admin/product/update.ejs", {
    product,
    factoryOptions,
    targetOptions,
    errors,
  });
};
const handleUpdateProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const validate = UpdateProductSchema.safeParse(req.body);
    const {
      id,
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
    } = req.body as TProductUpdate;
    if (!validate.success) {
      const errorsZod = validate.error.issues;
      const errors = errorsZod?.map(
        (item) => `${item.message} (${item.path[0]})`
      );

      const id = req.body.id.toString();
      const product = await getProdcutById(id);
      return res.render("admin/product/update.ejs", {
        product,
        factoryOptions,
        targetOptions,
        errors,
      });
    }
    const image = req.file?.filename ?? null;
    const params = {
      id,
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      image,
    };
    await updateProductService(params);
    const products = await getAllProductService();
    return res.render("admin/product/product.ejs", { products });
  } catch (error) {
    console.log(error);
  }
};

export {
  handleCreateProduct,
  getAdminCreateProduct,
  handleDeleteProduct,
  handleGetUpdateProduct,
  handleUpdateProduct,
};

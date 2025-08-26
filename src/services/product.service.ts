import { prisma } from "config/client";
const handleCreateProductService = async (params: {
  name: string;
  price: number;
  detailDesc: string;
  shortDesc: string;
  target: string;
  quantity: number;
  factory: string;
  image: string;
}) => {
  try {
    const {
      name,
      price,
      target,
      quantity,
      factory,
      detailDesc,
      shortDesc,
      image,
    } = params;
    const product = await prisma.product.create({
      data: {
        name,
        price: +price,
        detailDesc,
        shortDesc,
        target,
        quantity: +quantity,
        factory,
        image,
      },
    });
    return product;
  } catch (error) {
    console.log(error);
  }
};
const getAllProductService = async () => {
  const products = await prisma.product.findMany();
  if (!products) {
    return [];
  }
  return products;
};
const getProdcutById = async (id: string): Promise<any> => {
  const product = await prisma.product.findFirst({
    where: { id: +id },
  });
  return product;
};
const updateProductService = async (params: {
  id: number;
  name?: string;
  price?: number;
  detailDesc?: string;
  shortDesc?: string;
  target?: string;
  quantity?: number;
  factory?: string;
  image?: string;
}) => {
  const {
    id,
    name,
    price,
    detailDesc,
    shortDesc,
    quantity,
    factory,
    target,
    image,
  } = params;
  await prisma.product.update({
    where: {
      id: +id,
    },
    data: {
      name,
      price: +price,
      factory,
      detailDesc,
      shortDesc,
      quantity: +quantity,
      image,
      target,
    },
  });
};
export {
  handleCreateProductService,
  getAllProductService,
  getProdcutById,
  updateProductService,
};

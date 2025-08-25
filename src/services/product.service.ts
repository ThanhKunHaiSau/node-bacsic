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
  console.log("check parms,", params);
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
export { handleCreateProductService, getAllProductService };

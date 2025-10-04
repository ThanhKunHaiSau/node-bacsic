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
const getAllProductService = async (params: {
  limit: number;
  skip: number;
  filter?: any;
  sortP?: any;
}) => {
  const products = await prisma.product.findMany({
    where: params.filter,
    take: params.limit || 10,
    skip: params.skip,
    orderBy: params.sortP,
  });
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
const handlePlaceOrder = async (params: {
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  userId: number;
  totalPrice: number;
}) => {
  const { receiverName, receiverAddress, receiverPhone, userId, totalPrice } =
    params;
  try {
    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          cartDetails: true,
        },
      });
      if (cart) {
        const dataOderDetail =
          cart?.cartDetails?.map((item) => {
            return {
              price: item.price,
              quantity: item.quantity,
              productId: item.productId,
            };
          }) || [];
        await tx.order.create({
          data: {
            receiverName,
            receiverAddress,
            receiverPhone,
            paymentMethod: "COD",
            paymentStatus: "PAYMENT_UNPAID",
            status: "PENDING",
            totalPrice: +totalPrice,
            userId,
            orderDetails: {
              create: dataOderDetail,
            },
          },
        });
        await tx.cartDetail.deleteMany({
          where: { cartId: cart.id },
        });
        await tx.cart.delete({
          where: {
            id: cart.id,
          },
        });
        for (let i = 0; i < dataOderDetail.length; i++) {
          const productId = dataOderDetail[i].productId;
          const product = await tx.product.findUnique({
            where: {
              id: productId,
            },
          });
          if (!product || product.quantity < dataOderDetail[i].quantity) {
            throw new Error(
              `Product ${product.name} not found or not enough quantity! `
            );
          }
          await tx.product.update({
            where: {
              id: productId,
            },
            data: {
              quantity: {
                decrement: dataOderDetail[i].quantity,
              },
              sold: {
                increment: dataOderDetail[i].quantity,
              },
            },
          });
        }
      } else {
        throw new Error("Cart not found");
      }
    });
    return "";
  } catch (error) {
    console.log("checkđa", error);
    return error;
  }
};
export {
  handleCreateProductService,
  getAllProductService,
  getProdcutById,
  updateProductService,
  handlePlaceOrder,
};

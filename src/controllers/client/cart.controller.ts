import { User } from "@prisma/client";
import { prisma } from "config/client";
import { Request, Response } from "express";
import { handlePlaceOrder } from "services/client/product.service";
const fs = require("node:fs");

const handleAddToCart = async (req: Request, res: Response) => {
  const { productId } = req.params;
  console.log("dadadad", productId);
  const user = req.user as Express.User;
  const { quantity } = req.body;

  const checkCartExist = await prisma.cart.findUnique({
    where: { userId: user.id },
  });
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });
  
  if (checkCartExist) {
    await prisma.cart.update({
      where: { userId: user.id },
      data: {
        sum: { increment: quantity || 1 },
      },
    });
    await prisma.cartDetail.upsert({
      where: {
        cartId_productId: {
          cartId: checkCartExist.id,
          productId: Number(productId),
        },
      },
      update: {
        quantity: { increment: quantity || 1 },
      },
      create: {
        cartId: checkCartExist.id,
        productId: Number(productId),
        quantity: quantity || 1,
        price: product?.price || 0,
      },
    });
    res.redirect("/");
  } else {
    await prisma.cart.create({
      data: {
        sum: quantity || 1,
        userId: user.id,
        cartDetails: {
          create: [
            {
              productId: Number(productId),
              quantity: quantity || 1,
              price: product?.price || 0,
            },
          ],
        },
      },
    });
    res.redirect("/");
  }
};
const getCartPage = async (req: Request, res: Response) => {
  const user = req.user as Express.User;

  const { products, totalCart } = await fetchAllProductsCarts(user);
  console.log("checa", products);
  return res.render("client/product/cart.ejs", { products, totalCart });
};
const fetchAllProductsCarts = async (
  user: Express.User
): Promise<{ products: any[]; totalCart: number }> => {
  let products: any[] = [];
  let totalCart = 0;
  const cartUser = await prisma.cart.findUnique({
    where: { userId: user.id },
  });
  if (cartUser) {
    const productsCart = await prisma.cartDetail.findMany({
      where: { cartId: cartUser.id },
      include: {
        product: {
          select: { id: true, name: true, price: true, image: true },
        },
      },
    });

    products = productsCart.map((item) => ({
      ...item,
      total: item.quantity * item.product.price,
    }));
    totalCart = products.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );
  }

  return { products, totalCart };
};
const handleDeleteProductCart = async (req: Request, res: Response) => {
  const id = req.params.id;
  const findCart = await prisma.cartDetail.findUnique({
    where: {
      id: +id,
    },
  });
  if (findCart) {
    await prisma.cartDetail.delete({
      where: {
        id: +id,
      },
    });
    const data = await prisma.cart.update({
      where: {
        id: findCart.cartId,
      },
      data: {
        sum: {
          decrement: findCart.quantity,
        },
      },
    });
  }

  return res.redirect("/cart");
};
const updateProductCart = async (req: Request, res: Response) => {
  const { cartDetailId, quantity } = req.body;
  const user = req.user;
  const cartExist = await prisma.cartDetail.findUnique({
    where: {
      id: +cartDetailId,
    },
  });
  if (cartExist) {
    await prisma.cartDetail.update({
      where: {
        id: +cartDetailId,
      },
      data: {
        quantity,
      },
    });
    await fetchAllProductsCarts(user);
  } else {
    throw new Error("error form servcer!");
  }
  return res.redirect("/cart");
};
const getCheckoutPage = async (req: Request, res: Response) => {
  const user = req.user as Express.User;

  const { products, totalCart } = await fetchAllProductsCarts(user);
  return res.render("client/product/checkout.ejs", { products, totalCart });
};
const postPlaceOder = async (req: Request, res: Response) => {
  const user = req.user as Express.User;
  const { receiverName, receiverAddress, receiverPhone, totalPrice } = req.body;
  const params = {
    receiverName,
    receiverAddress,
    receiverPhone,
    userId: user.id,
    totalPrice,
  };
  await handlePlaceOrder(params);

  return res.redirect("/thanks");
};
const getThanksPage = async (req: Request, res: Response) => {
  return res.render("client/product/thanks.ejs");
};
const getPageHistory = async (req: Request, res: Response) => {
  const user = req.user as Express.User;
  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      orderDetails: {
        select: {
          product: true,
        },
      },
    },
  });
  fs.writeFile("aelx.json", JSON.stringify(orders), (err) => {
    if (err) throw err;
    console.log("Saved!");
  });
  console.log("check orders");
  return res.render("client/product/history.ejs", { orders });
};
export {
  handleAddToCart,
  getCartPage,
  handleDeleteProductCart,
  updateProductCart,
  getCheckoutPage,
  postPlaceOder,
  getThanksPage,
  getPageHistory,
};

import { User } from "@prisma/client";
import { prisma } from "config/client";
import { Request, Response } from "express";

const handleAddToCart = async (req: Request, res: Response) => {
  const { productId } = req.params;
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
export { handleAddToCart };

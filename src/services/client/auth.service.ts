import { prisma } from "config/client";
import bcrypt from "bcrypt";
import { handleHashPassword } from "services/user.service";
import { ACCOUNT_TYPE } from "config/constant";

const checkUserExist = async (email: string) => {
  const exist = await prisma.user.findFirst({
    where: {
      username: email,
    },
  });
  if (!exist) {
    return false;
  }
  return true;
};
const postRegisterService = async (params: {
  fullname: string;
  password: string;
  email: string;
}) => {
  const hashPassword = await handleHashPassword(params.password);
  const role = await prisma.role.findUnique({
    where: {
      name: "USER",
    },
    select: {
      id: true,
    },
  });
  if (role) {
    await prisma.user.create({
      data: {
        username: params.email,
        password: hashPassword,
        fullName: params.fullname,
        accountType: ACCOUNT_TYPE.SYSTEM,
        roleId: role.id,
      },
    });
  }
};
const getRoleUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: { role: true },
    omit: { password: true },
  });
  return user;
};
const getSumCart = async (id: string) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: +id,
    },
  });
  if (!cart) return 0;
  else {
    const totalProdcutC = await prisma.cartDetail.findMany({
      where: {
        cartId: cart.id,
      },
    });

    const total = totalProdcutC.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
    return total || 0;
  }
};
export { checkUserExist, postRegisterService, getRoleUserById, getSumCart };

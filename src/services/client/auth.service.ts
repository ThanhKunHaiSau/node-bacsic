import jwt from "jsonwebtoken";
import { prisma } from "config/client";
import bcrypt from "bcrypt";
import { handleHashPassword } from "services/user.service";
import { ACCOUNT_TYPE } from "config/constant";
import "dotenv/config";

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
  fullName: string;
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
        fullName: params.fullName,
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
const handleLoginUser = async (
  username: string,
  password: string
): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      role: true,
    },
  });
  if (!user) {
    throw new Error(`Not found user: ${username} `);
  }
  const compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    throw new Error("Wrong password");
  }
  // nếu có và đúng mật khẩu thì tao token
  const payload = {
    id: user.id,
    username: user.username,
    fullname: user.fullName,
    role: user.role,
    roleId: user.roleId,
    accountType: user.accountType,
    avatar: user.avatar,
  };
  const secret = process.env.JWT_SECRET;
  const expire = process.env.JWT_EXPIRES_IN as any;
  const access_token = jwt.sign(payload, secret, {
    expiresIn: expire,
  }) as string;
  return access_token;
};
export {
  checkUserExist,
  postRegisterService,
  getRoleUserById,
  getSumCart,
  handleLoginUser,
};

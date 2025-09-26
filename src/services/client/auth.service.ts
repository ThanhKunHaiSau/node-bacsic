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
export { checkUserExist, postRegisterService, getRoleUserById };

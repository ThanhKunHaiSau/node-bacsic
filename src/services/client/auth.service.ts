import { prisma } from "config/client";
import bcrypt from "bcrypt";
import { handleHashPassword } from "services/user.service";
import { ACCOUNT_TYPE } from "config/constant";

const handleLoginService = async (
  username: string,
  password: string,
  cb: any
) => {
  try {
    const errors = [];
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      errors.push(`Not found user ${username}`);

      return cb(null, false, {
        message: `Not found user ${username}`,
      });
    }
    const compare = await comparePassword(password, user.password);
    if (!compare) {
      errors.push("Wrong password");
      return cb(null, false, {
        message: "Wrong password",
      });
    }
    const { password: _, ...safeUser } = user;

    return cb(null, user);
  } catch (error) {
    console.log(error);
  }
};
const comparePassword = async (password: string, existPassword: string) => {
  const compare = bcrypt.compareSync(password, existPassword);
  return compare;
};
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
export { handleLoginService, checkUserExist, postRegisterService };

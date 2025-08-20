import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import bcrypt from "bcrypt";
const handleHashPassword = (password: string): Promise<string> => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  return Promise.resolve(hash);
};
const createUserService = async (params: {
  fullname: string;
  username: string;
  address: string;
  phone: string;
  role: number;
  avatar: string;
  password: string;
}) => {
  const { fullname, username, address, phone, role, avatar, password } = params;

  try {
    // const checkExis = await prisma.user.findFirst({
    //   where: {
    //     username: username,
    //   },
    // });
    const hashedPassword = await handleHashPassword(password);
    // if (checkExis) return Promise.reject("User already exists");
    const user = await prisma.user.create({
      data: {
        username: username,
        fullName: fullname,
        address: address,
        phone: phone,
        accountType: ACCOUNT_TYPE.SYSTEM,
        avatar: avatar,
        roleId: +role,
        password: hashedPassword,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
const getHomePageService = async () => {
  try {
    const results = await prisma.user.findMany();
    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
};
const deleteUserService = async (id: string) => {
  try {
    const idUser = Number(id);
    await prisma.user.delete({
      where: {
        id: idUser,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
const fillDataUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  return user;
};
const updateUserService = async (params: {
  id: string;
  name: string;
  address: string;
  phone: string;
  avatar: string;
  roleId: string;
  fullName: string;
  username: string;
}) => {
  try {
    await prisma.user.update({
      where: {
        id: Number(params.id),
      },
      data: {
        username: params.username,
        fullName: params.fullName,
        accountType: ACCOUNT_TYPE.SYSTEM,
        address: params.address,
        phone: params.phone,
        avatar: params.avatar,
        roleId: +params.roleId,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
const getRolesService = async () => {
  try {
    const roles = await prisma.role.findMany();
    return roles;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export {
  createUserService,
  getHomePageService,
  deleteUserService,
  fillDataUser,
  updateUserService,
  getRolesService,
  handleHashPassword,
};

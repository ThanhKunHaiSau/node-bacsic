import { prisma } from "config/client";

const createUserService = async (params: {
  name: string;
  email: string;
  address: string;
}) => {
  const { name, email, address } = params;
  try {
    const checkExis = await prisma.user.findFirst({
      where: {
        username: email,
      },
    });
    if (checkExis) return Promise.reject("User already exists");
    const user = await prisma.user.create({
      data: {
        username: email,
        fullName: name,
        address: address,
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
const updateUserService = async (
  id: string,
  params: { name: string; email: string; address: string }
) => {
  try {
    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        username: params.name,
        address: params.address,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
export {
  createUserService,
  getHomePageService,
  deleteUserService,
  fillDataUser,
  updateUserService,
};

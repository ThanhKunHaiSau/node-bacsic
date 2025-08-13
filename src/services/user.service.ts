import { Field } from "./../../node_modules/mysql2/typings/mysql/lib/parsers/typeCast.d";
import { getConnection } from "../config/database";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "config/client";

const createUserService = async (params: {
  name: string;
  email: string;
  address: string;
}) => {
  const { name, email, address } = params;
  try {
    const checkExis = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (checkExis) return Promise.reject("User already exists");
    const user = await prisma.users.create({
      data: {
        email: email,
        name: name,
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
    const results = await prisma.users.findMany();
    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
};
const deleteUserService = async (id: string) => {
  try {
    const idUser = Number(id);
    await prisma.users.delete({
      where: {
        id: idUser,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
const fillDataUser = async (id: string) => {
  const connection = await getConnection();
  const [rows] = await connection.query(
    "SELECT * FROM `users` WHERE `id` = ?",
    [id]
  );
  return rows[0];
};
const updateUserService = async (
  id: string,
  params: { name: string; email: string; address: string }
) => {
  try {
    await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        name: params.name,
        email: params.email,
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

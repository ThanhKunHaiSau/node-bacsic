import { prisma } from "config/client";
import { User } from "controllers/interface/user.interface";
import { Request, Response } from "express";
import {
  TCreateUserSchema,
  TUpdateUserSchema,
} from "src/validation/auth.validate";

const getAllUser = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return res.status(200).json(users);
};
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("id", id);
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ data: user });
};
const createUser = async (req: Request, res: Response) => {
  const { username, password, fullName, address, phone } = req.body as User;
  const validate = TCreateUserSchema.safeParse(req.body);
  if (!validate.success) {
    return res
      .status(400)
      .json({ message: "Invalid data", errors: validate.error.errors });
  }
  const user = await prisma.user.create({
    data: {
      username,
      password,
      fullName,
      address,
      phone,
      accountType: "USER",
      role: { connect: { id: 1 } },
    },
  });
  return res.status(201).json({ data: user });
};
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, fullName, address, phone } = req.body as User;
  const validate = TUpdateUserSchema.safeParse(req.body);
  if (!validate.success) {
    return res
      .status(400)
      .json({ message: "Invalid data", errors: validate.error.errors });
  }
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      username,
      fullName,
      address,
      phone,
    },
  });
  return res.status(200).json({ data: user });
};
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id: Number(id) },
  });
  return res.status(204).send({ messeage: "delete success" });
};
export { getAllUser, getUserById, createUser, updateUser, deleteUser };

import { Field } from "./../../node_modules/mysql2/typings/mysql/lib/parsers/typeCast.d";
import { getConnection } from "../config/database";

const createUserService = async (params: {
  name: string;
  email: string;
  address: string;
}) => {
  const { name, email, address } = params;
  const connection = await getConnection();
  try {
    const [results] = await connection.query(
      "INSERT INTO `users` (`name`, `email`, `address`) VALUES (?, ?, ?)",
      [name, email, address]
    );
    return;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
const getHomePageService = async () => {
  const connection = await getConnection();
  try {
    const [results, fields] = await connection.query("SELECT * FROM `users`");
    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
};
const deleteUserService = async (id: string) => {
  const connection = await getConnection();
  try {
    await connection.query("DELETE FROM `users` WHERE `id` = ?", [id]);
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
  const connection = await getConnection();
  try {
    await connection.query(
      "UPDATE `users` SET `name` = ?, `email` = ?, `address` = ? WHERE `id` = ?",
      [params.name, params.email, params.address, id]
    );
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

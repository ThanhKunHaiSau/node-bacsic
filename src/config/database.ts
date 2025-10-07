import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const getConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "db",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "123456",
    database: process.env.DB_NAME || "mydb",
  });
  return connection;
};

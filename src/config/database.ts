import mysql from "mysql2/promise";

export const getConnection = async () => {
  const connection = await mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    database: "nodejs",
    password: "123456", // replace with your actual password
  });
  return connection;
};

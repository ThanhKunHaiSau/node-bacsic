import { prisma } from "./client";
export const initDatabBase = async () => {
  const dataExist = await prisma.user.count();
  console.log("Data exist: ", dataExist);
  if (dataExist > 0) return;

  await prisma.user.createMany({
    data: [
      {
        username: "anhnt@fpt.com",
        password: "123456",
        accountType: "admin",
      },
      {
        username: "anhnt525@fpt.com",
        password: "123456",
        accountType: "admin",
      },
    ],
  });
  console.log("Seeding data successfully");
};

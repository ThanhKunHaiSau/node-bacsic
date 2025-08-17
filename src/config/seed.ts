import { prisma } from "./client";
export const initDatabBase = async () => {
  const dataExist = await prisma.user.count();
  const roleExist = await prisma.role.count();
  if (dataExist === 0) {
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
  } else if (roleExist === 0) {
    await prisma.role.createMany({
      data: [
        {
          name: "ADMIN",
          description: "Administrator with full access",
        },
        {
          name: "USER",
          description: "Regular user with limited access",
        },
      ],
    });
  }

  console.log("Seeding data successfully");
};

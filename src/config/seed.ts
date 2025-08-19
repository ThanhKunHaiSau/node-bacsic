import { handleHashPassword } from "services/user.service";
import { prisma } from "./client";
import { ACCOUNT_TYPE } from "./constant";
export const initDatabBase = async () => {
  const dataExist = await prisma.user.count();
  const roleExist = await prisma.role.count();
  const password = await handleHashPassword("123456");
  if (dataExist === 0) {
    await prisma.user.createMany({
      data: [
        {
          fullName: "Admin",
          username: "anhnt@fpt.com",
          password: password,
          accountType: ACCOUNT_TYPE.SYSTEM,
        },
        {
          fullName: "User",
          username: "anhnt525@fpt.com",
          password: password,
          accountType: ACCOUNT_TYPE.SYSTEM,
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

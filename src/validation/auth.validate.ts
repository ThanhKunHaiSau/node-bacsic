import { checkUserExist } from "services/client/auth.service";
import * as z from "zod";
export const AuthSchema = z
  .object({
    username: z
      .string()
      .email()
      .trim()
      .refine((str) => str !== "", {
        message: "please enter username",
      }),
    password: z
      .string()
      .trim()
      .refine((str) => str !== "", {
        message: "please enter password",
      }),
  })
  .refine(
    async (data) => {
      const userExist = await checkUserExist(data.username);
      return userExist;
    },
    {
      message: "Not found User!",
    }
  );
export type TAuth = z.infer<typeof AuthSchema>;
const emailSchema = z
  .string()
  .email("Email invalid format!")
  .refine(
    async (email) => {
      const userExist = await checkUserExist(email);
      return !userExist;
    },
    {
      message: "Username already exist",
      path: ["username"],
    }
  );
const passwordSchema = z
  .string()
  .min(3, { message: "Min character password is 3" })
  .max(20, { message: "Max character password is 20" })
  // .refine((password) => /[A-Z]/.test(password), {
  //   message: uppercaseErrorMessage,
  // })
  // .refine((password) => /[a-z]/.test(password), {
  //   message: lowercaseErrorMessage,
  // })
  // .refine((password) => /[0-9]/.test(password), { message: numberErrorMessage })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: "specialCharacterErrorMessage",
  });
export const TRegisterSchema = z
  .object({
    email: emailSchema,
    fullname: z
      .string()
      .trim()
      .refine((name) => name !== "", { message: "Full name is required!" }),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .trim()
      .refine((str) => str !== "", {
        message: "please enter password again",
      }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password confirm not exactly",
    path: ["confirmPassword"],
  });
export type TRegister = z.infer<typeof TRegisterSchema>;

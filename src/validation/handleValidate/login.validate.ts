import { TUser } from "src/types/auth.type";
import { AuthSchema, TAuth } from "../auth.validate";

const validateAuth = async (data: TUser) => {
  const validate = await AuthSchema.safeParseAsync(data);

  if (!validate.success) {
    const errorsZod = validate.error.issues;
    const errors = errorsZod.map((item) => `${item.message} (${item.path[0]})`);
    return errors;
  }

  return [];
};

export { validateAuth };

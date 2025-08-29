import bcrypt from "bcrypt";
import { prisma } from "../config/client";
const passport = require("passport");
import { Strategy as LocalStrategy } from "passport-local";
import { handleLoginService } from "services/client/auth.service";
const configPassport = () => {
  passport.use(
    new LocalStrategy(function verify(username, password, cb) {
      console.log("alex nguuen", username, passport);
      return handleLoginService(username, password, cb);
    })
  );
};
export default configPassport;

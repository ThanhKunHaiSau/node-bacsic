import bcrypt from "bcrypt";
import { prisma } from "../config/client";
const passport = require("passport");
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { get } from "http";
import { getUserById } from "services/user.service";
import { getRoleUserById, getSumCart } from "services/client/auth.service";
const configPassport = () => {
  passport.use(
    new LocalStrategy({ passReqToCallback: true }, async function verify(
      req,
      username,
      password,
      cb
    ) {
      const { session } = req as any;
      if (session?.messages?.length) {
        session.messages = [];
      }
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return cb(null, false, {
          message: `Not found user ${username}`,
        });
      }
      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        return cb(null, false, {
          message: "Wrong password",
        });
      }
      return cb(null, user as any);
    })
  );
  // tra session ve user de luu vao session(tra ve client)
  passport.serializeUser(function (user: any, callback) {
    callback(null, { id: user.id, username: user.username });
  });

  passport.deserializeUser(async function (user: any, callback) {
    const { id, username } = user;

    const userDb = await getRoleUserById(id);
    const sumCart = await getSumCart(id);
    console.log("userDb", sumCart);
    return callback(null, { ...userDb, sumCart });
  });
};
export default configPassport;

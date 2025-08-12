import express, { Express } from "express";
import { getCreateUser, getHomePage } from "../controllers/user.controller";
const router = express.Router();
const initWebRoute = (app: Express) => {
  router.get("/", getHomePage);

  router.get("/create-user", getCreateUser);
  app.use("/", router);
};

export default initWebRoute;

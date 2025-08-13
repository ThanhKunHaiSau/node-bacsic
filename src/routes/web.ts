import express, { Express } from "express";
import {
  deleteUser,
  editUser,
  getCreateUser,
  getHomePage,
  handleUpdateUser,
  postCreateUser,
} from "../controllers/user.controller";
const router = express.Router();
const initWebRoute = (app: Express) => {
  router.get("/", getHomePage);

  router.get("/create-user", getCreateUser);
  router.post("/create-new-user", postCreateUser);
  router.post("/delete-user/:id", deleteUser);
  router.post("/edit-user/:id", editUser);
  router.post("/update-user", handleUpdateUser);
  app.use("/", router);
};

export default initWebRoute;

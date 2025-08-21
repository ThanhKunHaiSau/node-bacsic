import express, { Express, Request, Response } from "express";
import {
  deleteUser,
  editUser,
  getCreateUser,
  getHomePage,
  handleUpdateUser,
  postCreateUser,
} from "../controllers/user.controller";
import {
  getAdminOrderPage,
  getAdminProductPage,
  getAdminUserPage,
  getDashboardPage,
} from "controllers/admin/dashboard.controller";
import { fromSlugRomaji, toSlug } from "controllers/admin/d";
import fileUploadMiddleware from "src/middleware/multer";
import { getProductPage } from "controllers/client/product.controller";
const router = express.Router();
const initWebRoute = (app: Express) => {
  router.get("/", getHomePage);

  router.get("/create-user", getCreateUser);
  router.post("/delete-user/:id", deleteUser);
  router.post("/edit-user/:id", editUser);
  router.post("/update-user", fileUploadMiddleware("avatar"), handleUpdateUser);
  //admin
  router.post(
    "/admin/create-new-user",
    fileUploadMiddleware("avatar"),
    postCreateUser
  );
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/order", getAdminOrderPage);
  //client
  router.get("/product/:id", getProductPage);
  app.use("/", router);
};

export default initWebRoute;

import express, { Express, NextFunction, Request, Response } from "express";
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
import fileUploadMiddleware from "src/middleware/multer";
import { getProductPage } from "controllers/client/product.controller";
import {
  getAdminCreateProduct,
  handleCreateProduct,
  handleDeleteProduct,
  handleGetUpdateProduct,
  handleUpdateProduct,
} from "controllers/admin/product.controller";
import {
  getLogin,
  getNotHavePermission,
  getSucucessLogin,
  postRegister,
  register,
} from "controllers/client/auth.controller";
import passport from "passport";
import { isLogin, verifyRoleAdmin } from "src/middleware/auth";
import {
  getCartPage,
  handleAddToCart,
  handleDeleteProductCart,
  updateProductCart,
} from "controllers/client/cart.controller";
const router = express.Router();
const initWebRoute = (app: Express) => {
  router.get("/", getHomePage);

  router.get("/create-user", getCreateUser);
  router.post("/delete-user/:id", deleteUser);
  router.post("/edit-user/:id", editUser);
  router.post("/update-user", fileUploadMiddleware("avatar"), handleUpdateUser);
  //auth
  router.get("/get-not-have-permission", getNotHavePermission);

  router.get("/get-login-success", getSucucessLogin);
  router.get("/login", getLogin);
  app.post("/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
  router.get("/register", register);
  router.post("/register", postRegister);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/get-login-success",
      failureRedirect: "/login",
      failureMessage: true,
    })
  );
  //admin
  router.post(
    "/admin/create-new-user",
    fileUploadMiddleware("avatar"),
    postCreateUser
  );
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/order", getAdminOrderPage);
  //product
  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/products/create-product", getAdminCreateProduct);
  router.post(
    "/admin/products/handle-create-product",
    fileUploadMiddleware("image", "images/products"),
    handleCreateProduct
  );
  router.get("/admin/products/delete/:id", handleDeleteProduct);
  router.get("/admin/products/update/:id", handleGetUpdateProduct);
  router.post(
    "/admin/update",
    fileUploadMiddleware("image", "images/products"),
    handleUpdateProduct
  );
  //client
  router.get("/product/:id", getProductPage);
  router.post("/add-product-to-cart/:productId", isLogin, handleAddToCart);
  router.get("/cart", isLogin, getCartPage);
  router.post("/delete-product-cart/:id", handleDeleteProductCart);
  router.post("/cart/update", updateProductCart);
  app.use("/", verifyRoleAdmin, router);
};

export default initWebRoute;

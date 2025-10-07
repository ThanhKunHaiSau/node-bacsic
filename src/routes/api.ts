import {
  createUser,
  deleteUser,
  fetchAccountAPI,
  getAllUser,
  getUserById,
  handleLogin,
  updateUser,
} from "controllers/apitest/user.controler";
import express, { Express } from "express";
import { checkValidJWT } from "src/middleware/jwt.middleware";
const router = express.Router();

const apiRouter = (app: Express) => {
  router.get("/users", getAllUser);
  router.get("/user/:id", getUserById);
  router.post("/users", createUser);
  router.put("/update-user/:id", updateUser);
  router.delete("/users/:id", deleteUser);

  // jwt
  router.post("/login", handleLogin);
  router.get("/account", fetchAccountAPI);
  app.use("/api/v1", checkValidJWT, router);
};
export default apiRouter;

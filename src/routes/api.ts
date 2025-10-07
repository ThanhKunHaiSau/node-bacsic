import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  updateUser,
} from "controllers/apitest/user.controler";
import express, { Express } from "express";
const router = express.Router();

const apiRouter = (app: Express) => {
  router.get("/get-all-users", getAllUser);
  router.get("/user/:id", getUserById);
  router.post("/user", createUser);
  router.put("/update-user/:id", updateUser);
  router.delete("/delete-user/:id", deleteUser);
  app.use("/api/v1", router);
};
export default apiRouter;

import express from "express";
require("dotenv").config();

const app = express();
//config view engine
app.set("view engine", "ejs");
app.set("views", "./src/view");
const router = express.Router();
app.use("/", router);

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/theanh", (req, res) => {
  res.render("theanh", { title: "The Anh" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port : ${process.env.PORT || 3001}`);
});

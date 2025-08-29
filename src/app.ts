import initDatabBase from "config/seed";
import express from "express";
import initWebRoute from "./routes/web";
import { getConnection } from "./config/database";
import path from "path";
import passport from "passport";
import configPassport from "./middleware/passport";
require("dotenv").config();
const app = express();
//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// config passport
app.use(passport.initialize());
configPassport();
//config static files
app.use(express.static("public"));
//config view engine

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/view"));
//connect to db
getConnection();
//config router
initWebRoute(app);

//seeding data
initDatabBase();
//handle not found
app.use((req, res) => {
  return res.render("client/home/notfound.ejs");
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port : ${process.env.PORT || 3001}`);
});

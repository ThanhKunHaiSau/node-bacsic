import initDatabBase from "config/seed";
import express from "express";
import initWebRoute from "./routes/web";
import { getConnection } from "./config/database";
import path from "path";
import passport from "passport";
import configPassport from "./middleware/passport";
const i18n = require("i18n");
const cookieParser = require("cookie-parser");

import type { Response } from "express";

declare global {
  namespace Express {
    interface Response {
      __(phraseOrOptions: any, ...replace: any[]): string;
    }
  }
}

i18n.configure({
  locales: ["en", "vi"], // danh sách ngôn ngữ hỗ trợ
  directory: __dirname + "/locales", // thư mục chứa file json
  defaultLocale: "en", // ngôn ngữ mặc định
  queryParameter: "lang", // cho phép ?lang=vi
  cookie: "lang", // đọc từ cookie
});

require("dotenv").config();
const app = express();
app.use(i18n.init);

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
app.get("/welcome", (req, res) => {
  res.json({ message: res.__("welcome") });
});

app.get("/login", (req, res) => {
  res.json({ message: res.__("login") });
});

// Đổi ngôn ngữ bằng query
app.get("/setlang/:lang", (req, res) => {
  res.cookie("lang", req.params.lang);
  res.json({ message: `Language changed to ${req.params.lang}` });
});
app.use((req, res) => {
  return res.render("client/home/notfound.ejs");
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port : ${process.env.PORT || 3001}`);
});

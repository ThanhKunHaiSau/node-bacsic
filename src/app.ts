/// <reference path="./interface/user.d.ts" />
import initDatabBase from "config/seed";
import express from "express";
import initWebRoute from "./routes/web";
import { getConnection } from "./config/database";
import path from "path";
import passport from "passport";
import configPassport from "./middleware/passport";
import session from "express-session";
import apiRouter from "routes/api";
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
import cors from "cors";
const app = express();
//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

//config session
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
// config passport
app.use(passport.initialize());
app.use(passport.authenticate("session"));
configPassport();
//config static files
app.use(express.static("public"));
//config view engine

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/view"));
//make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Pass user object to all views
  next();
});

//connect to db
getConnection();
//config router
// initWebRoute(app);
apiRouter(app);
//seeding data
initDatabBase();
//handle not found
app.use((req, res) => {
  return res.render("client/home/notfound.ejs");
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port : ${process.env.PORT || 3001}`);
});

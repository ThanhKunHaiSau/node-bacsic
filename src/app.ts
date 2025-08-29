import initDatabBase from "config/seed";
import express from "express";
import initWebRoute from "./routes/web";
import { getConnection } from "./config/database";
import path from "path";
import { startUserSubscriber } from "controllers/redis/subscriber";
require("dotenv").config();
const app = express();
//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.listen(process.env.PORT || 3000, async () => {
  console.log(`App is running on port : ${process.env.PORT || 3001}`);
  await startUserSubscriber();
});

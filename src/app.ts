import express from "express";
import initWebRoute from "./routes/web";
require("dotenv").config();
const app = express();
//config router
initWebRoute(app);
//config view engine
app.set("view engine", "ejs");
app.set("views", "./src/view");
//config static files
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port : ${process.env.PORT || 3001}`);
});

const express = require("express");
const path = require("path");
const homeRoutes = require("./routes/home.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "website" });
});

app.use("/", homeRoutes);

module.exports = app;

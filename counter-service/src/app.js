const express = require("express");
const cors = require("cors");
const counterRoutes = require("./routes/counter.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "counter-service" });
});

app.use("/api", counterRoutes);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

module.exports = app;

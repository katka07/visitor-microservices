const express = require("express");
const router = express.Router();
const counterController = require("../controllers/counter.controller");

router.get("/count", counterController.getCount);
router.post("/increment", counterController.incrementCount);

module.exports = router;

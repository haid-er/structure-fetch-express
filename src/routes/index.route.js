const express = require("express");
const router = express.Router();

const { defaultController } = require("../controllers/index.controller");

const userRoutes = require("./user.routes");
router.get("/", defaultController);
router.use("/user", userRoutes);

module.exports = router;

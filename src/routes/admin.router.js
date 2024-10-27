const express = require("express");
const {
  createAdmin,
  loginAdmin,
  createSuperAdmin,
} = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth");
const { roles } = require("../config/config");

const router = express.Router();

router.post("/create/super-admin", createSuperAdmin);

router.post("/create", authMiddleware([roles.superAdmin]), createAdmin);

router.post("/login", loginAdmin);

module.exports = router;

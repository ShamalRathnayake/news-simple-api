const express = require("express");
const {
  createNews,
  updateNews,
  deleteNews,
  getAllNews,
} = require("../controllers/news.controller");
const authMiddleware = require("../middlewares/auth");
const { roles } = require("../config/config");

const router = express.Router();

router.post("/", authMiddleware([roles.admin, roles.superAdmin]), createNews);

router.put("/", authMiddleware([roles.admin, roles.superAdmin]), updateNews);

router.delete(
  "/:id",
  authMiddleware([roles.admin, roles.superAdmin]),
  deleteNews
);

router.get("/", getAllNews);

module.exports = router;

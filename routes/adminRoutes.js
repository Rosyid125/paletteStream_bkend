const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");
const { verifyAccessToken } = require("../middlewares/authMiddleware");

router.get("/users", verifyAccessToken, verifyAdminRole, AdminController.getUsers);
router.put("/users/:id/ban", verifyAccessToken, verifyAdminRole, AdminController.banUser);
router.put("/users/:id", verifyAccessToken, verifyAdminRole, AdminController.editUser);
router.delete("/users/:id", verifyAccessToken, verifyAdminRole, AdminController.deleteUser);
router.get("/posts", verifyAccessToken, verifyAdminRole, AdminController.getPosts);
router.delete("/posts/:id", verifyAccessToken, verifyAdminRole, AdminController.deletePost);
router.get("/dashboard", verifyAccessToken, verifyAdminRole, AdminController.getDashboard);
router.get("/dashboard/trends", verifyAccessToken, verifyAdminRole, AdminController.getDashboardTrends);

module.exports = router;

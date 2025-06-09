const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");

router.get("/users", verifyAdminRole, AdminController.getUsers);
router.put("/users/:id/ban", verifyAdminRole, AdminController.banUser);
router.put("/users/:id", verifyAdminRole, AdminController.editUser);
router.delete("/users/:id", verifyAdminRole, AdminController.deleteUser);
router.get("/posts", verifyAdminRole, AdminController.getPosts);
router.delete("/posts/:id", verifyAdminRole, AdminController.deletePost);
router.get("/dashboard", verifyAdminRole, AdminController.getDashboard);
router.get("/dashboard/trends", verifyAdminRole, AdminController.getDashboardTrends);

module.exports = router;

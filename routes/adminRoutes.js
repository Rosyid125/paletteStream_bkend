const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const { verifyAdminRole } = require("../middlewares/roleMiddleware");

router.get("/admin/users", verifyAdminRole, AdminController.getUsers);
router.put("/admin/users/:id/ban", verifyAdminRole, AdminController.banUser);
router.put("/admin/users/:id", verifyAdminRole, AdminController.editUser);
router.delete("/admin/users/:id", verifyAdminRole, AdminController.deleteUser);
router.get("/admin/posts", verifyAdminRole, AdminController.getPosts);
router.delete("/admin/posts/:id", verifyAdminRole, AdminController.deletePost);
router.get("/admin/dashboard", verifyAdminRole, AdminController.getDashboard);

module.exports = router;

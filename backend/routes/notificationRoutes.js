const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  markAllAsRead
} = require("../controllers/notificationController");

// 🔥 Get all notifications
router.get("/", verifyToken, getMyNotifications);

// 🔥 Mark all as read (NEW)
router.put("/read-all", verifyToken, markAllAsRead);

module.exports = router;
const express = require("express");
const router = express.Router();

const { createComplaint, getMyComplaints, getAllComplaints, getAssignedComplaints, updateStatus } = require("../controllers/complaintController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
  
})

router.post("/create", verifyToken, upload.single("image"), createComplaint);

// 👤 Student
router.get("/my", verifyToken, getMyComplaints);

// 👨‍💼 Admin
router.get("/all", verifyToken, getAllComplaints);

// Admin only
router.get("/assigned", verifyToken, isAdmin, getAssignedComplaints);
router.put("/status/:id", verifyToken, isAdmin, updateStatus);

module.exports = router;
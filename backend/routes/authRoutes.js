const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

// 👇 middleware import
const { verifyToken } = require("../middleware/authMiddleware");

// routes
router.post("/register", register);
router.post("/login", login);

// 👇 protected route
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user
  });
});

module.exports = router;
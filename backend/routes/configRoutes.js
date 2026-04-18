const express = require("express");
const router = express.Router();

const categories = require("../config/categories");
const departments = require("../config/departments");

// ✅ all config here
router.get("/categories", (req, res) => {
  res.json(categories);
});

router.get("/departments", (req, res) => {
  res.json(departments);
});

module.exports = router;
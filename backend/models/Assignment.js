const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    unique: true
  },
  lastIndex: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Assignment", assignmentSchema);
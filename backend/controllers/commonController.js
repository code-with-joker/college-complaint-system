const departments = require("../config/departments");

exports.getDepartments = (req, res) => {
  res.json(departments);
};
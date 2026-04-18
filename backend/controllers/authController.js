const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Complaint = require("../models/Complaint");
const { sendEmail } = require("../services/email.service");
const { welcomeTemplate } = require("../templates/welcomeEmail");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body || {};

    // ✅ validation
    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (name.length < 3) {
      return res.status(400).json({ error: "Name too short" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be 6+ chars" });
    }

    // ✅ check existing
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ FIXED: role + department add
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      department
    });

    await user.save();

    // 🔥 BACKFILL (only admin)
    if (user.role === "admin") {

      const pendingComplaints = await Complaint.find({
        department: user.department,
        assignedTo: null
      });

      for (let complaint of pendingComplaints) {
        complaint.assignedTo = user._id;
        await complaint.save();
      }
    }

    await sendEmail({
      to: user.email,
      subject: "Welcome to CampusResolve 🎉",
      html: welcomeTemplate({
        name: user.name,
        email: user.email,
        password: password, // jo user ne diya
        department: user.department,
        role: user.role
      })
    });

    res.status(201).json({ 
      message: "User registered successfully",
      emailSent: true 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // ✅ check fields
    if (!email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // ✅ check user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ generate token (FIXED HERE ONLY)
    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.name,      // 👈 added
        email: user.email,    // 👈 added
        role: user.role ,
        department: user.department
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
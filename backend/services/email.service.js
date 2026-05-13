const nodemailer = require("nodemailer");

// 🔥 transporter (PRODUCTION SAFE)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  tls: {
    rejectUnauthorized: false
  },

  family: 4 // ✅ FORCE IPv4 (IMPORTANT FOR RENDER)
});

// 🔥 reusable send function
exports.sendEmail = async ({ to, subject, html }) => {
  try {

    await transporter.sendMail({
      from: `"CampusResolve" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    // console.log("📧 Email sent to:", to);

    return true;

  } catch (err) {

    console.log("❌ Email error:", err.message);

    return false;
  }
};
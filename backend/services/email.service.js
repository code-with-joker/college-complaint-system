const nodemailer = require("nodemailer");

// 🔥 transporter (SMTP setup)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
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

  } catch (err) {
    console.log("❌ Email error:", err.message);
  }
};
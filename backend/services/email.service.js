const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
console.log(process.env.SMTP_USER)
// 🔥 reusable send function
exports.sendEmail = async ({ to, subject, html }) => {
  try {

    await transporter.sendMail({
      from: `"CampusResolve" <kishankumarmth2006@gmail.com>`,
      to,
      subject,
      html
    });

    console.log("📧 Email sent to:", to);

    return true;

  } catch (err) {

    console.log("❌ Email error:", err.message);

    return false;
  }
};
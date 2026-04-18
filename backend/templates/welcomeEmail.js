exports.welcomeTemplate = ({ name, email, password, department, role }) => {
  return `
  <div style="font-family: Arial; background:#f4f6f9; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:20px;">

      <h2 style="color:#2563eb;">Welcome to CampusResolve 🎉</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>Your account has been successfully created.</p>

      <div style="background:#f9fafb; padding:15px; border-radius:8px; margin-top:10px;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Department:</strong> ${department}</p>
      </div>

      <p style="margin-top:15px;">
        You can now login and start using the system.
      </p>

      <div style="margin-top:20px;">
        <a href="http://localhost:3000/login"
           style="background:#2563eb; color:white; padding:10px 15px; text-decoration:none; border-radius:5px;">
          Login Now
        </a>
      </div>

      <p style="margin-top:20px; font-size:12px; color:gray;">
        If you didn’t create this account, please ignore this email.
      </p>

    </div>
  </div>
  `;
};
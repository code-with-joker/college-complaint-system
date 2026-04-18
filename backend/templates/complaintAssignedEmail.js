exports.complaintAssignedTemplate = ({
  adminName,
  title,
  description,
  category,
  priority,
  location
}) => {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color:#2563eb;">📢 New Complaint Assigned</h2>

      <p>Hello <b>${adminName}</b>,</p>

      <p>A new complaint has been assigned to you:</p>

      <div style="background:#f3f4f6; padding:15px; border-radius:10px;">
        <p><b>Title:</b> ${title}</p>
        <p><b>Description:</b> ${description}</p>
        <p><b>Category:</b> ${category}</p>
        <p><b>Priority:</b> ${priority}</p>
        <p><b>Location:</b> ${location}</p>
      </div>

      <p style="margin-top:15px;">
        Please take action as soon as possible.
      </p>

      <p style="color:#6b7280;">– CampusResolve Team</p>
    </div>
  `;
};
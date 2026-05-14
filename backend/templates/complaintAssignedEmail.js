exports.complaintAssignedTemplate = ({
  adminName,
  title,
  description,
  category,
  priority,
  location
}) => {

  // 🎨 priority color
  const priorityColor = {
    Low: "#22c55e",
    Medium: "#eab308",
    High: "#f97316",
    Emergency: "#ef4444"
  };

  return `
  <div style="
    margin:0;
    padding:40px 20px;
    background:#f3f4f6;
    font-family:Arial,sans-serif;
  ">

    <div style="
      max-width:600px;
      margin:auto;
      background:white;
      border-radius:18px;
      overflow:hidden;
      box-shadow:0 10px 25px rgba(0,0,0,0.08);
    ">

      <!-- HEADER -->
      <div style="
        background:linear-gradient(135deg,#2563eb,#1e40af);
        padding:30px;
        text-align:center;
        color:white;
      ">
        <h1 style="
          margin:0;
          font-size:28px;
        ">
          📢 New Complaint Assigned
        </h1>

        <p style="
          margin-top:10px;
          opacity:0.9;
          font-size:14px;
        ">
          CampusResolve Complaint Management System
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:30px;">

        <p style="
          font-size:16px;
          color:#111827;
        ">
          Hello <b>${adminName}</b>,
        </p>

        <p style="
          color:#4b5563;
          line-height:1.7;
          font-size:15px;
        ">
          A new complaint has been assigned to you. 
          Please review the details below and take the necessary action.
        </p>

        <!-- CARD -->
        <div style="
          margin-top:25px;
          background:#f9fafb;
          border:1px solid #e5e7eb;
          border-radius:14px;
          padding:22px;
        ">

          <div style="margin-bottom:15px;">
            <span style="
              background:#dbeafe;
              color:#1d4ed8;
              padding:6px 12px;
              border-radius:999px;
              font-size:12px;
              font-weight:bold;
            ">
              ${category}
            </span>

            <span style="
              background:${priorityColor[priority] || "#6b7280"};

              color:white;
              padding:6px 12px;
              border-radius:999px;
              font-size:12px;
              font-weight:bold;
              margin-left:8px;
            ">
              ${priority}
            </span>
          </div>

          <h2 style="
            margin:0 0 10px 0;
            color:#111827;
            font-size:22px;
          ">
            ${title}
          </h2>

          <p style="
            color:#4b5563;
            line-height:1.7;
            font-size:14px;
            margin-bottom:18px;
          ">
            ${description}
          </p>

          <div style="
            display:flex;
            align-items:center;
            gap:8px;
            font-size:14px;
            color:#374151;
          ">
            📍 <b>Location:</b> ${location}
          </div>

        </div>

        <!-- ACTION -->
        <div style="
          margin-top:30px;
          text-align:center;
        ">
          <a href="#"
            style="
              display:inline-block;
              background:#2563eb;
              color:white;
              text-decoration:none;
              padding:14px 24px;
              border-radius:10px;
              font-weight:bold;
              font-size:14px;
            "
          >
            View Complaint
          </a>
        </div>

        <p style="
          margin-top:35px;
          font-size:13px;
          color:#6b7280;
          line-height:1.6;
          text-align:center;
        ">
          Please resolve the issue as soon as possible to ensure smooth campus operations.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="
        background:#f9fafb;
        padding:18px;
        text-align:center;
        border-top:1px solid #e5e7eb;
      ">
        <p style="
          margin:0;
          color:#6b7280;
          font-size:13px;
        ">
          © 2026 CampusResolve • Smart Complaint Management System
        </p>
      </div>

    </div>

  </div>
  `;
};
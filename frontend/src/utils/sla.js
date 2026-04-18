// utils/sla.js

export const slaMap = {
  Low: 72,
  Medium: 48,
  High: 24,
  Emergency: 4
};

// 🔥 MAIN FUNCTION
export const getSLA = (complaint) => {
  if (!complaint) return null;

  const slaHours = slaMap[complaint.priority] || 24;

  const createdTime = new Date(complaint.createdAt);
  const deadline = new Date(createdTime);
  deadline.setHours(deadline.getHours() + slaHours);

  const now = new Date();
  const timeDiff = deadline - now;
  const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));

  // ✅ RESOLVED CASE
  if (complaint.status === "Resolved") {
    const resolvedTime = new Date(
      complaint.resolvedAt || complaint.updatedAt
    );

    const timeTakenMs = resolvedTime - createdTime;
    const hrs = Math.floor(timeTakenMs / (1000 * 60 * 60));
    const mins = Math.floor((timeTakenMs / (1000 * 60)) % 60);

    return {
      text:
        resolvedTime <= deadline
          ? "Resolved Within SLA"
          : "SLA Breached",
      color:
        resolvedTime <= deadline
          ? "text-green-600"
          : "text-red-600",
      timeTaken: `${hrs}h ${mins}m`,
      deadline,
      isResolved: true
    };
  }

  // ❌ NOT RESOLVED
  let text = "";
  let color = "";

  if (timeDiff <= 0) {
    text = "Overdue";
    color = "text-red-600";
  } else if (hoursLeft <= 6) {
    text = "Near Deadline";
    color = "text-yellow-600";
  } else {
    text = "On Time";
    color = "text-green-600";
  }

  const minutesLeft = Math.floor(timeDiff / (1000 * 60));
  const hrs = Math.max(0, Math.floor(minutesLeft / 60));
  const mins = Math.max(0, minutesLeft % 60);

  return {
    text,
    color,
    timeLeft: `${hrs}h ${mins}m`,
    deadline,
    slaHours,
    isResolved: false
  };
};
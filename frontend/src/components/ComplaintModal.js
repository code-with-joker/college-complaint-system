import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ComplaintModal({ data, onClose, onUpdate }) {
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const slaMap = {
    Low: 72,
    Medium: 48,
    High: 24,
    Emergency: 4
  };

  if (!data) return null;

  const slaHours = slaMap[data.priority] || 24;

  const createdTime = new Date(data.createdAt);
  const deadline = new Date(createdTime);
  deadline.setHours(deadline.getHours() + slaHours);

  const timeDiff = deadline - now;
  const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));

  const minutesLeft = Math.floor(timeDiff / (1000 * 60));
  const hrs = Math.max(0, Math.floor(minutesLeft / 60));
  const mins = Math.max(0, minutesLeft % 60);

  let slaStatus = "";
  let slaColor = "";

  if (timeDiff <= 0) {
    slaStatus = "Overdue";
    slaColor = "bg-red-100 text-red-600";
  } else if (hoursLeft <= 6) {
    slaStatus = "Near Deadline";
    slaColor = "bg-yellow-100 text-yellow-600";
  } else {
    slaStatus = "On Time";
    slaColor = "bg-green-100 text-green-600";
  }

  // ✅ NEW: resolved check
  const isResolved = data.status === "Resolved";

  // ✅ NEW: SLA result after completion
  let resolutionStatus = "";
  let timeTaken = "";

  if (isResolved) {
    const resolvedTime = new Date(data.resolvedAt || data.updatedAt);

    const durationMs = resolvedTime - createdTime;

    const totalMinutes = Math.floor(durationMs / (1000 * 60));
    const hoursTaken = Math.floor(totalMinutes / 60);
    const minutesTaken = totalMinutes % 60;

    timeTaken = `${hoursTaken}h ${minutesTaken}m`;

    if (resolvedTime <= deadline) {
      resolutionStatus = "Resolved Within SLA";
    } else {
      resolutionStatus = "SLA Breached";
    }
  }

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/complaints/status/${data._id}`,
        { status, remarks },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Updated",
        timer: 1200,
        showConfirmButton: false
      });

      onUpdate(data._id, status);
      onClose();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-xl rounded-2xl p-6 relative animate-fadeIn">

        <button onClick={onClose} className="absolute top-3 right-4 text-xl">
          ✕
        </button>

        <h2 className="text-xl font-bold">{data.title}</h2>
        <p className="text-gray-500 text-sm">Complaint</p>

        {/* INFO */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
          <p>📍 {data.location}</p>
          <p>📅 {new Date(data.createdAt).toLocaleString()}</p>
          <p>👤 {data.student?.name || "Student"}</p>

          {/* 🔥 SLA WHEN NOT RESOLVED */}
          {!isResolved && (
            <>
              <div className="flex items-center gap-2 mt-2">
                <span>⏱ SLA:</span>

                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${slaColor}`}>
                  {slaStatus}
                </span>

                <span className="text-xs text-gray-500">
                  ({slaHours} hrs)
                </span>
              </div>

            </>
          )}

          {/* 🔥 AFTER RESOLVED */}
          {isResolved && (
            <div className="mt-2">
              <p className={`text-sm font-medium ${
                resolutionStatus === "Resolved Within SLA"
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                {resolutionStatus}
              </p>

              <p className="text-xs text-gray-500">
                ⏱ Solved in {timeTaken}
              </p>
            </div>
          )}
        </div>

        {/* 🔥 SHOW ONLY IF NOT RESOLVED */}
        {!isResolved && (
          <>
            <p className="text-xs text-gray-500 mt-1">
              ⏳ {timeDiff > 0 ? `${hrs}h ${mins}m left` : "Time exceeded"}
            </p>

            <p className="text-xs text-gray-400">
              📅 Deadline: {deadline.toLocaleString()}
            </p>
          </>
        )}

        {/* 🔥 SHOW AFTER RESOLUTION */}
        {isResolved && (
          <p className={`text-sm mt-2 font-medium ${
            resolutionStatus === "Resolved Within SLA"
              ? "text-green-600"
              : "text-red-600"
          }`}>
            {resolutionStatus}
          </p>
        )}

        {/* TAGS */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
            {data.category}
          </span>

          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs">
            {data.priority}
          </span>

          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
            {data.status}
          </span>
        </div>

        {/* IMAGE */}
        {data.imageUrl && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Attachment</p>

            <img
              src={data.imageUrl}
              alt="complaint"
              className="w-full h-48 object-cover rounded-lg border hover:scale-105 transition"
            />
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="mt-5">
          <h3 className="font-semibold mb-1">Description</h3>
          <p className="text-gray-600 text-sm">
            {data.description}
          </p>
        </div>

        {/* UPDATE */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Update Status</h3>

          <select
            className="w-full p-3 border rounded-lg mb-3"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select new status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <textarea
            placeholder="Add remarks..."
            className="w-full p-3 border rounded-lg mb-4"
            onChange={(e) => setRemarks(e.target.value)}
          />

          <button
            onClick={handleUpdate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Update Status
          </button>
        </div>

      </div>
    </div>
  );
}
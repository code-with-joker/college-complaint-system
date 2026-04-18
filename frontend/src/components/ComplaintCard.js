import { getSLA } from "../utils/sla";

export default function ComplaintCard({ item }) {
  const sla = getSLA(item);

  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-300">

      {/* 🔷 Top Section */}
      <div className="flex justify-between items-start gap-2">

        <h3 className="text-base md:text-lg font-semibold text-gray-800 leading-snug">
          {item.title}
        </h3>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap
          ${item.status === "Pending" && "bg-yellow-100 text-yellow-700"}
          ${item.status === "In Progress" && "bg-blue-100 text-blue-700"}
          ${item.status === "Resolved" && "bg-green-100 text-green-700"}
        `}
        >
          {item.status}
        </span>
      </div>

      {/* 📍 Location */}
      <p className="text-xs md:text-sm text-gray-500 mt-1">
        📍 {item.location}
      </p>

      {/* 📝 Description */}
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
        {item.description}
      </p>

      {/* 🔥 SLA Section */}
      <div className="mt-3 flex flex-col gap-1">

        <p className={`text-xs font-semibold ${sla.color}`}>
          ⏱ {sla.text}
        </p>

        {!sla.isResolved && (
          <p className="text-xs text-gray-500">
            ⏳ {sla.timeLeft}
          </p>
        )}

        {sla.isResolved && (
          <p className="text-xs text-gray-500">
            ⏱ Solved in {sla.timeTaken}
          </p>
        )}

      </div>

      {/* 🏷 Category + Priority */}
      <div className="flex gap-2 mt-3 flex-wrap">

        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          {item.category}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium
          ${item.priority === "High" && "bg-red-100 text-red-600"}
          ${item.priority === "Medium" && "bg-yellow-100 text-yellow-600"}
          ${item.priority === "Low" && "bg-green-100 text-green-600"}
          ${item.priority === "Emergency" && "bg-red-200 text-red-700"}
        `}
        >
          ⚡ {item.priority}
        </span>

      </div>

      {/* 🧾 Remarks (compact + modern) */}
      {item.remarks?.length > 0 && (
        <div className="mt-4 border-t pt-3">

          <p className="text-xs font-semibold text-gray-500 mb-2">
            Recent Updates
          </p>

          <div className="space-y-2 max-h-20 overflow-y-auto pr-1">
            {item.remarks.slice(-2).map((r, i) => (
              <div key={i} className="text-xs bg-gray-50 p-2 rounded-lg">

                <p className="font-medium text-blue-600">
                  {r.updatedBy?.name}
                </p>

                <p className="text-gray-600">
                  {r.text}
                </p>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* 🔻 Footer */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-4 text-xs text-gray-500">

        <p className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full inline-block w-fit">
          👨‍🏫 {item.assignedTo?.name || "Not Assigned"}
        </p>

        <span>
          🕒 {new Date(item.createdAt).toLocaleString()}
        </span>

      </div>

    </div>
  );
}
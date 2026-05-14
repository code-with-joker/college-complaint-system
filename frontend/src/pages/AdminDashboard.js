import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import ComplaintModal from "../components/ComplaintModal";
import { getSLA } from "../utils/sla";
import apiClient from "../services/apiClient";
import { ENDPOINTS } from "../utils/endpoints";

import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar
} from "lucide-react";

export default function AdminDashboard() {

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  // ✅ FETCH ASSIGNED COMPLAINTS
  useEffect(() => {

    const fetchData = async () => {
      try {

        const res = await apiClient.get(
          ENDPOINTS.COMPLAINTS.ASSIGNED
        );

        console.log("Assigned Complaints:", res.data);

        setComplaints(res.data.complaints || []);

      } catch (err) {

        console.log(
          "ASSIGNED ERROR:",
          err.response?.data || err.message
        );
      }
    };

    fetchData();

  }, []);

  // ✅ FETCH NOTIFICATIONS
  useEffect(() => {

    const fetchNotifications = async () => {
      try {

        const res = await apiClient.get(
          ENDPOINTS.NOTIFICATIONS.GET_ALL
        );

        setNotifications(res.data || []);

      } catch (err) {

        console.log(
          "NOTIFICATION ERROR:",
          err.response?.data || err.message
        );
      }
    };

    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      5000
    );

    return () => clearInterval(interval);

  }, []);

  // ✅ UPDATE STATUS UI
  const updateStatus = (id, status) => {

    setComplaints((prev) =>
      prev.map((c) =>
        c._id === id
          ? { ...c, status }
          : c
      )
    );
  };

  // ✅ STATS
  const total = complaints.length;

  const pending = complaints.filter(
    c => c.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    c => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    c => c.status === "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Department Dashboard
          </h2>

          <p className="text-gray-500 text-sm">
            {user?.department
              ? `${user.department} Department`
              : ""}
            {" "}Manage assigned complaints
          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Assigned
              </p>

              <h2 className="text-2xl font-bold">
                {total}
              </h2>
            </div>

            <ClipboardList className="text-blue-600" />
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <h2 className="text-2xl font-bold">
                {pending}
              </h2>
            </div>

            <Clock className="text-yellow-600" />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                In Progress
              </p>

              <h2 className="text-2xl font-bold">
                {inProgress}
              </h2>
            </div>

            <AlertTriangle className="text-gray-600" />
          </div>

          <div className="bg-green-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Resolved
              </p>

              <h2 className="text-2xl font-bold">
                {resolved}
              </h2>
            </div>

            <CheckCircle className="text-green-600" />
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow p-4 md:p-6">

          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Assigned Complaints
          </h3>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="text-gray-500 border-b text-left">

                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Complaint</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">SLA</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Action</th>
                </tr>

              </thead>

              <tbody>

                {complaints.map((c, index) => {

                  const sla = getSLA(c);

                  return (
                    <tr
                      key={c._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      <td className="py-4 px-4 text-gray-400">
                        #{index + 1}
                      </td>

                      <td className="py-4 px-4">

                        <p className="font-medium text-gray-800">
                          {c.title}
                        </p>

                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {c.category}
                        </span>

                      </td>

                      <td className="py-4 px-4">

                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${c.priority === "High" && "bg-red-100 text-red-600"}
                          ${c.priority === "Medium" && "bg-yellow-100 text-yellow-600"}
                          ${c.priority === "Low" && "bg-green-100 text-green-600"}
                          ${c.priority === "Emergency" && "bg-red-200 text-red-700"}
                        `}>
                          ⚡ {c.priority}
                        </span>

                      </td>

                      <td className="py-4 px-4">

                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${c.status === "Pending" && "bg-yellow-100 text-yellow-600"}
                          ${c.status === "In Progress" && "bg-blue-100 text-blue-600"}
                          ${c.status === "Resolved" && "bg-green-100 text-green-600"}
                        `}>
                          {c.status}
                        </span>

                      </td>

                      <td className="py-4 px-4">

                        <p className={`text-xs font-semibold ${sla.color}`}>
                          {sla.text}
                        </p>

                        {!sla.isResolved && (
                          <p className="text-xs text-gray-400">
                            {sla.timeLeft}
                          </p>
                        )}

                        {sla.isResolved && (
                          <p className="text-xs text-gray-400">
                            {sla.timeTaken}
                          </p>
                        )}

                      </td>

                      <td className="py-4 px-4 text-xs text-gray-500">

                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {c.location}
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          <Calendar size={12} />
                          {new Date(c.createdAt).toLocaleDateString()}
                        </div>

                      </td>

                      <td className="py-4 px-4">

                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs hover:bg-blue-100 transition"
                        >
                          View
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

            {complaints.length === 0 && (
              <p className="text-center py-6 text-gray-500">
                No complaints assigned 🚫
              </p>
            )}

          </div>

        </div>

      </div>

      {/* MODAL */}
      {selectedComplaint && (
        <ComplaintModal
          data={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdate={updateStatus}
        />
      )}

    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import { ENDPOINTS } from "../utils/endpoints";
import { jwtDecode } from "jwt-decode";
import {
  ClipboardList,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

import ComplaintList from "../components/ComplaintList";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔔 notifications
  const [notifications, setNotifications] = useState([]);

  

  // 🔐 Auth
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Unauthorized",
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => navigate("/login"), 1500);
    } else {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, [navigate]);

  // 🔥 complaints
  useEffect(() => {
    let isMounted = true;

    const fetchComplaints = async () => {
      try {
        const res = await apiClient.get(
          ENDPOINTS.COMPLAINTS.MY
        );

        if (isMounted) {
          setComplaints(res.data.complaints || []);
        }

      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchComplaints();

    return () => {
      isMounted = false;
    };
  }, []);

  // 🔔 notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiClient.get(
          ENDPOINTS.NOTIFICATIONS.GET_ALL
        );

        setNotifications(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();

    // 🔁 auto refresh every 5 sec
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);

  }, []);

  // 🔢 Stats
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="min-h-screen bg-gray-200">

      {/* ✅ REUSABLE NAVBAR */}
      <Navbar 
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <div className="p-6 max-w-6xl mx-auto">

        {/* Heading */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">
              {user?.name} Dashboard
            </h2>
            <p className="text-gray-500">
              Track and manage your complaints
            </p>
          </div>

          <Link
            to="/complaint"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
          >
            + New Complaint
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-5 mt-6">

          <div className="bg-blue-50 p-5 rounded-xl flex justify-between items-center">
            <div>
              <p>Total</p>
              <h2 className="text-3xl font-bold">{total}</h2>
            </div>
            <ClipboardList />
          </div>

          <div className="bg-yellow-50 p-5 rounded-xl flex justify-between items-center">
            <div>
              <p>Pending</p>
              <h2 className="text-3xl font-bold">{pending}</h2>
            </div>
            <Clock />
          </div>

          <div className="bg-gray-50 p-5 rounded-xl flex justify-between items-center">
            <div>
              <p>In Progress</p>
              <h2 className="text-3xl font-bold">{inProgress}</h2>
            </div>
            <AlertTriangle />
          </div>

          <div className="bg-green-50 p-5 rounded-xl flex justify-between items-center">
            <div>
              <p>Resolved</p>
              <h2 className="text-3xl font-bold">{resolved}</h2>
            </div>
            <CheckCircle />
          </div>

        </div>

      </div>

      {/* Complaint List */}
      <div className="p-10 mx-auto max-w-8xl">
        <ComplaintList data={complaints} loading={loading} />
      </div>

    </div>
  );
}
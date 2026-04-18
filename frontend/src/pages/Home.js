import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Zap,
  Clock,
  BarChart3,
  Bell,
  ShieldCheck
} from "lucide-react";
import { isLoggedIn } from "../utils/auth";
import { handleProtectedRoute } from "../utils/navigation";

export default function Home() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  // handleProtectedRoute(navigate, loggedIn ? "/" : "/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 px-6">

      {/* Navbar */}
      <div className="flex justify-between items-center py-4">
        <h1 className="text-xl font-bold text-blue-600">
          CampusResolve
        </h1>

        <div className="space-x-4 flex items-center">

          {/* ✅ If logged in → Dashboard */}
          {loggedIn ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-700">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mt-20">

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Report Issues.{" "}
          <span className="text-blue-600">Track Progress.</span>
          <br />
          Get Results.
        </h1>

        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          A centralized platform for students to report complaints,
          track status, and get quick resolutions.
        </p>

        <div className="mt-6 space-x-4">

          {/* 🔥 Submit Complaint (Protected) */}
          <button
            onClick={() => handleProtectedRoute(navigate, "/complaint")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Submit a Complaint →
          </button>

          {/* 🔥 Login button */}
          {!loggedIn && (
            <Link
              to="/login"
              className="bg-gray-200 px-6 py-3 rounded-lg"
            >
              Login
            </Link>
          )}

        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">

        <div className="bg-white p-4 rounded-xl text-center shadow">
          <h2 className="text-2xl font-bold text-blue-600">500+</h2>
          <p className="text-sm text-gray-500">Complaints Resolved</p>
        </div>

        <div className="bg-white p-4 rounded-xl text-center shadow">
          <h2 className="text-2xl font-bold text-blue-600">24h</h2>
          <p className="text-sm text-gray-500">Avg Time</p>
        </div>

        <div className="bg-white p-4 rounded-xl text-center shadow">
          <h2 className="text-2xl font-bold text-blue-600">95%</h2>
          <p className="text-sm text-gray-500">Satisfaction</p>
        </div>

        <div className="bg-white p-4 rounded-xl text-center shadow">
          <h2 className="text-2xl font-bold text-blue-600">6</h2>
          <p className="text-sm text-gray-500">Departments</p>
        </div>

      </div>

      <div className="mt-20 px-4 pb-10">

        {/* Heading */}
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">
            Everything You Need for Efficient Campus Management
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Our platform provides all the tools needed to streamline complaint handling
            and improve campus infrastructure.
            </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6 ">

            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300">
            <ClipboardList size={28} className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Easy Complaint Submission</h3>
            <p className="text-sm text-gray-500 mt-1">
                Submit complaints with just a few clicks, add photos and categories.
            </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300">
            <Zap className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Smart Routing</h3>
            <p className="text-sm text-gray-500 mt-1">
                Complaints are routed automatically to the right department.
            </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300">
            <Clock className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">SLA Tracking</h3>
            <p className="text-sm text-gray-500 mt-1">
                Track resolution time with real-time updates.
            </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300">
            <BarChart3 className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Analytics Dashboard</h3>
            <p className="text-sm text-gray-500 mt-1">
                Identify patterns and improve infrastructure.
            </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300">
            <Bell className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Instant Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">
                Get real-time updates on complaint status.
            </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition duration-300">
            <ShieldCheck className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg">Secure & Transparent</h3>
            <p className="text-sm text-gray-500 mt-1">
                Role-based access ensures security and transparency.
            </p>
            </div>

        </div>
        </div>

    </div>
  );
}
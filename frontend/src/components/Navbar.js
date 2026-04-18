import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NotificationBell from "./NotificationBell";

export default function Navbar({ notifications = [], setNotifications }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-4 md:px-6 py-3 bg-white shadow">

      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-blue-600 font-bold text-lg cursor-pointer"
      >
        CampusResolve
      </h1>

      <div className="flex items-center gap-3">

        {/* 🔔 REUSABLE NOTIFICATION */}
        <NotificationBell 
          notifications={notifications}
          setNotifications={setNotifications}
        />

        {/* User */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
          <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
          <span className="text-sm">{user?.name}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-red-500 text-sm"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
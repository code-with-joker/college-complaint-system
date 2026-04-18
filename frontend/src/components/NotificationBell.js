import { useState } from "react";
import NotificationModal from "./NotificationModal";
import apiClient from "../services/apiClient";

export default function NotificationBell({ notifications, setNotifications }) {
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleOpen = async () => {
    setOpen(true);

    try {
      // 🔥 mark all as read
      await apiClient.put("/notifications/read-all");

      // 🔥 UI update instantly
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        onClick={handleOpen} // 🔥 FIX HERE
        className="relative cursor-pointer w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
export default function NotificationModal({ notifications, onClose }) {

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">

      {/* SIDE PANEL */}
      <div className="bg-white w-full max-w-sm h-full p-4 shadow-lg animate-slideIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Notifications</h2>

          <button onClick={onClose} className="text-xl">✕</button>
        </div>

        {/* List */}
        <div className="space-y-3 overflow-y-auto max-h-[85vh]">

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center">
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className="p-3 rounded-lg border bg-gray-50"
              >
                <p className="text-sm">{n.message}</p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}
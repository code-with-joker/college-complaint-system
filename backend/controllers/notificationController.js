const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
  try {
    // 🔐 safety check (IMPORTANT)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const notifications = await Notification.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .lean(); // 🔥 performance boost (optional but good)

    res.status(200).json(notifications);

  } catch (err) {
    console.log("❌ Notification Error:", err.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { 
        isRead: true,
        readAt: new Date() 
      }
    );

    res.json({ message: "All notifications marked as read" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
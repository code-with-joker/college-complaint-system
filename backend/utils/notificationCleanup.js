const cron = require("node-cron");
const Notification = require("../models/Notification");

// 🔁 every 1 minute run (testing fast output)
cron.schedule("* * * * *", async () => {
  try {
    // 🕒 1 minute ago (testing)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const result = await Notification.deleteMany({
      isRead: true,
      readAt: { $lte: oneMinuteAgo }
    });

    if (result.deletedCount > 0) {
      console.log(`🗑 Deleted ${result.deletedCount} notifications`);
    }

  } catch (err) {
    console.log("❌ Notification cleanup error:", err.message);
  }
});
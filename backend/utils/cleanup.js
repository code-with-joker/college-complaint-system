const cron = require("node-cron");
const Complaint = require("../models/Complaint");
const { deleteFile } = require("../services/storage.service");

// 🕒 Run daily at 2 AM
cron.schedule("0 2 * * *", async () => {
  console.log("🧹 Cleanup job started...");

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const complaints = await Complaint.find({
      status: "Resolved",
      resolvedAt: { $lte: sevenDaysAgo }
    }).select("_id imageFileId");

    if (!complaints.length) {
      console.log("ℹ️ No complaints to delete");
      return;
    }

    // 🔥 parallel processing (faster)
    await Promise.all(
      complaints.map(async (c) => {
        try {
          // delete image
          if (c.imageFileId) {
            await deleteFile(c.imageFileId);
          }

          // delete complaint
          await Complaint.findByIdAndDelete(c._id);

        } catch (err) {
          console.log(`❌ Failed for complaint ${c._id}:`, err.message);
        }
      })
    );

    console.log(`✅ Deleted ${complaints.length} complaints`);

  } catch (err) {
    console.log("❌ Cleanup error:", err.message);
  }
});
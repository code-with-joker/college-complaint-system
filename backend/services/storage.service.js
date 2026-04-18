const imagekit = require("../config/imagekit");

// 🔥 UPLOAD
exports.uploadFile = async (file) => {
  const result = await imagekit.upload.files({
    file,
    fileName: "complaint_" + Date.now(),
    folder: "/complaints"
  });

  return result;
};

// 🔥 DELETE
exports.deleteFile = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
  } catch (err) {
    console.log("❌ Image delete error:", err.message);
  }
};
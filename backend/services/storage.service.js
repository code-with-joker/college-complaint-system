const imagekit = require("../config/imagekit");

exports.uploadFile = async (file) => {
  try {
    const result = await imagekit.upload({
      file: file,
      fileName: "complaint_" + Date.now(),
      folder: "complaints"
    });

    return result;

  } catch (err) {
    console.log("❌ Upload error:", err.message);
    throw err;
  }
};
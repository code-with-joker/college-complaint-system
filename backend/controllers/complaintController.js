const Complaint = require("../models/Complaint");
const {uploadFile, deleteFile} = require("../services/storage.service");
const { createNotification } = require("../utils/notify");
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const { sendEmail } = require("../services/email.service");
const { complaintAssignedTemplate } = require("../templates/complaintAssignedEmail");

// let lastAssignedIndex = {};
exports.createComplaint = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Only students can submit complaints" });
    }

    if (!req.user.department) {
      return res.status(400).json({ error: "User department missing" });
    }

    const { title, description, category, priority, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ error: "All required fields needed" });
    }

    const admins = await User.find({
      role: "admin",
      department: req.user.department
    }).sort({ _id: 1 });

    let assignedAdmin = null;

    if (admins.length > 0) {
      let record = await Assignment.findOne({
        department: req.user.department
      });

      if (!record) {
        record = await Assignment.create({
          department: req.user.department,
          lastIndex: -1
        });
      }

      const nextIndex = (record.lastIndex + 1) % admins.length;

      assignedAdmin = admins[nextIndex]._id;
      record.lastIndex = nextIndex;

      await record.save();
    }

    let imageUrl = "";
    let imageFileId = "";

    if (req.file) {
      const result = await uploadFile(req.file.buffer.toString("base64"));

      imageUrl = result.url;
      imageFileId = result.fileId;   // 🔥 IMPORTANT FIX
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      location,
      imageUrl,
      imageFileId,
      department: req.user.department,
      student: req.user.id,
      assignedTo: assignedAdmin,
      remarks: []
    });

    // 🔥 MOVE THIS BEFORE RESPONSE (important)
    if (assignedAdmin) {
      await createNotification(
        assignedAdmin,
        `New complaint assigned: ${title}`
      );

      const adminUser = await User.findById(assignedAdmin);

      if (adminUser?.email) {
        await sendEmail({
          to: adminUser.email,
          subject: "New Complaint Assigned 📢",
          html: complaintAssignedTemplate({
            adminName: adminUser.name,
            title,
            description,
            category,
            priority,
            location
          })
        });
      }
    }

    // ✅ RESPONSE LAST
    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMyComplaints = async (req, res) => {
  try {
    // 🔐 only student
    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Access denied" });
    }

    const complaints = await Complaint.find({ student: req.user.id })
      .populate("assignedTo", "name email") 
      .populate("remarks.updatedBy", "name")  // 🔥 ADD THIS
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      count: complaints.length,
      complaints
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    // 🔐 only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin only access" });
    }

    const complaints = await Complaint.find()
      .populate("student", "name email")   // 👈 useful
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: complaints.length,
      complaints
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignedComplaints = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin only access" });
    }

    const complaints = await Complaint.find({
      assignedTo: req.user.id
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: complaints.length,
      complaints
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status required" });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    if (!complaint.assignedTo) {
      return res.status(400).json({ error: "No admin assigned yet" });
    }

    if (complaint.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not your complaint" });
    }

    // update status
    complaint.status = status;

    if (status === "Resolved" && !complaint.resolvedAt) {
      complaint.resolvedAt = new Date();
    }

    // 🔥 SAFE ARRAY INIT
    if (!complaint.remarks) {
      complaint.remarks = [];
    }

    // 🔥 SAFE REMARK CHECK
    if (remarks && typeof remarks === "string" && remarks.trim() !== "") {
      complaint.remarks.push({
        text: remarks,
        status: status,
        updatedBy: req.user.id
      });
    }

    await complaint.save();

    await createNotification(
      complaint.student,
      `Your complaint "${complaint.title}" is now ${status}`
    );

    // 📧 EMAIL TO STUDENT (NEW)
    const studentUser = await User.findById(complaint.student);

    if (studentUser?.email) {
      await sendEmail({
        to: studentUser.email,
        subject: "Complaint Status Updated 🔄",
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2 style="color:#2563eb;">Complaint Update</h2>

            <p>Hello ${studentUser.name},</p>

            <p>Your complaint <b>"${complaint.title}"</b> status is now:</p>

            <h3 style="color:#16a34a;">${status}</h3>

            ${
              remarks
                ? `<p><b>Admin Remarks:</b> ${remarks}</p>`
                : ""
            }

            <p style="margin-top:15px;">
              Thank you for using CampusResolve 🙌
            </p>
          </div>
        `
      });
    }

  

    res.json({ message: "Status updated", complaint });

  } catch (err) {
    // console.log("ERROR:", err); // 👈 IMPORTANT
    res.status(500).json({ error: err.message });
  }
};
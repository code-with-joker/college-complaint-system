const mongoose = require("mongoose");
const categories = require("../config/categories");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: categories // 🔥 dynamic
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Emergency"],
      default: "Low"
    },

    location: {
      type: String,
      required: true
    },

    imageUrl: {
      type: String
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    department: {
      type: String,
      required: true
    },
    
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    remarks: [
      {
        text: String, 
        status: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    resolvedAt: {
      type: Date,
      default: null
    },

    imageFileId: {
      type: String
    }
    
  },

  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
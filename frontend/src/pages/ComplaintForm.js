import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../services/apiClient";
import { ENDPOINTS } from "../utils/endpoints";

export default function ComplaintForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    department: "",
    priority: "Low",
    location: ""
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  // 🔐 Check login
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Please login first",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => navigate("/login"), 1500);
    }
  }, [navigate]);

  // 🔥 FETCH CONFIG DATA (FIXED SAFELY)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depRes, catRes] = await Promise.all([
          apiClient.get(ENDPOINTS.CONFIG.DEPARTMENTS),
          apiClient.get(ENDPOINTS.CONFIG.CATEGORIES)
        ]);
        

        // ✅ IMPORTANT FIX (ensure array)
        setDepartments(Array.isArray(depRes.data) ? depRes.data : []);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);

      } catch (err) {
        
        console.log("CONFIG ERROR:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ BASIC VALIDATION (minimal add)
    if (!form.title || !form.description || !form.category || !form.department || !form.location) {
      return Swal.fire({
        icon: "warning",
        title: "All fields are required",
        timer: 1500,
        showConfirmButton: false
      });
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("department", form.department);
      formData.append("priority", form.priority);
      formData.append("location", form.location);

      if (image) {
        formData.append("image", image);
      }

      await apiClient.post(
        ENDPOINTS.COMPLAINTS.CREATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      Swal.fire({
        icon: "success",
        title: "Complaint Submitted ✅",
        html: `
          Your complaint has been submitted <br/>
          📧 Assigned admin has been notified
        `,
        timer: 2000,
        showConfirmButton: false
      });

      // ✅ FIX: department reset bhi add karo
      setForm({
        title: "",
        description: "",
        category: "",
        department: "",
        priority: "Low",
        location: ""
      });

      setImage(null);

      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.error || "Error",
        timer: 1500,
        showConfirmButton: false
      });
    }

    setLoading(false);
  };

  
  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1
          onClick={() => navigate("/")}
          className="text-blue-600 font-bold text-lg cursor-pointer"
        >
          CampusResolve
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 px-3 py-1 rounded-lg"
        >
          ← Back
        </button>
      </div>

      {/* FORM */}
      <div className="flex justify-center px-4 py-6">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow w-full max-w-xl"
        >
          <h2 className="text-2xl font-bold mb-5 text-center">
            Submit Complaint
          </h2>

          {/* Title */}
          <label className="text-sm font-semibold">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full p-3 mb-4 border rounded-lg focus:outline-blue-500"
          />

          {/* Description */}
          <label className="text-sm font-semibold">Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full p-3 mb-4 border rounded-lg focus:outline-blue-500"
          />

          {/* Category */}
          <label className="text-sm font-semibold">Category</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full p-3 mb-4 border rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Priority */}
          <label className="text-sm font-semibold">Priority</label>
          <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
            className="w-full p-3 mb-4 border rounded-lg"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Emergency</option>
          </select>

          {/* Department */}
          <label className="text-sm font-semibold">Department</label>
          <select
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
            className="w-full p-3 mb-4 border rounded-lg"
          >
            <option value="">Select Department</option>
            {departments.map((dep, i) => (
              <option key={i} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          {/* Location */}
          <label className="text-sm font-semibold">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className="w-full p-3 mb-4 border rounded-lg"
          />

          {/* Image */}
          <label className="text-sm font-semibold">
            Attach Image (Optional)
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="mb-4"
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
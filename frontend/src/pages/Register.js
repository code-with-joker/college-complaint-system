import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import logo from "../assets/vgu.jpg";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import { ENDPOINTS } from "../utils/endpoints";
import Swal from "sweetalert2";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ⚠️ IMPORTANT: backend enum ke saath match karo
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await apiClient.get(
          ENDPOINTS.CONFIG.DEPARTMENTS
        );

        // 🔥 FIX HERE
        setDepartments(res.data || []);

      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

    fetchDepartments();
  }, []);
  
 const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ FULL VALIDATION
    if (!form.name || !form.email || !form.password) {
      return Swal.fire({
        icon: "warning",
        title: "All fields required",
        timer: 1500,
        showConfirmButton: false
      });
    }

    if (!form.department) {
      return Swal.fire({
        icon: "warning",
        title: "Select department",
        timer: 1500,
        showConfirmButton: false
      });
    }

    setLoading(true);

    try {
      const res = await apiClient.post(
        ENDPOINTS.AUTH.REGISTER,
        form
      );

      // ✅ SAFE CHECK (avoid undefined issue)
      const emailSent = res?.data?.emailSent;

      Swal.fire({
        icon: "success",
        title: "Welcome to CampusResolve 🎉",
        html: `
          Account created successfully <br/>
          ${emailSent ? "📧 A welcome email has been sent" : "⚠️ Email could not be sent"}
        `,
        timer: 2500,
        showConfirmButton: false
      });

      // ✅ MATCH TIMER (important UX fix)
      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Something went wrong",
        timer: 2000,
        showConfirmButton: false
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-cyan-500">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4">
        <h1
          onClick={() => navigate("/")}
          className="text-white font-bold text-lg cursor-pointer"
        >
          CampusResolve
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="text-white bg-white/20 px-3 py-1 rounded-lg"
        >
          ← Back
        </button>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center px-4">

        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">

          <div className="flex justify-center mb-3">
            <img src={logo} alt="logo" className="w-16 h-16 rounded-full" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-1">
            Create Account 🚀
          </h2>

          <p className="text-center text-gray-500 text-sm mb-4">
            Join CampusResolve to report issues
          </p>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              className="w-full p-3 mb-3 border rounded-lg focus:outline-blue-500"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {/* Email */}
            <input
              type="email"
              placeholder="College Email"
              value={form.email}
              className="w-full p-3 mb-3 border rounded-lg focus:outline-blue-500"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            {/* Role */}
            <select
              value={form.role}
              className="w-full p-3 mb-3 border rounded-lg focus:outline-blue-500"
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>

            {/* Department */}
            <select
              value={form.department}
              className="w-full p-3 mb-3 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
            >
              <option value="">Select Department</option>

              {departments.map((dep, i) => (
                <option key={i} value={dep}>
                  {dep}
                </option>
              ))}
            </select>

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              className="w-full p-3 mb-4 border rounded-lg focus:outline-blue-500"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {/* Submit */}
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center hover:bg-blue-700 transition">
              {loading ? <Spinner /> : "Register"}
            </button>

          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}
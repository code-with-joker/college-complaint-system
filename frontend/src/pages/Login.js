import { useState } from "react";
import Spinner from "../components/Spinner";
import logo from "../assets/vgu.jpg";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import Swal from "sweetalert2";

import apiClient from "../services/apiClient";
import { ENDPOINTS } from "../utils/endpoints";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ basic validation (add this)
    if (!form.email || !form.password) {
      return Swal.fire({
        icon: "warning",
        title: "Enter email & password",
        timer: 1500,
        showConfirmButton: false
      });
    }

    setLoading(true);

    try {
      const res = await apiClient.post(
        ENDPOINTS.AUTH.LOGIN,
        form
      );

      // ✅ SAFE ACCESS (important fix)
      const token = res.data?.token;
      const user = res.data?.user;

      if (!token || !user) {
        throw new Error("Invalid server response");
      }

      // ✅ store token
      localStorage.setItem("token", token);

      Swal.fire({
        icon: "success",
        title: "Login Successful 🎉",
        text: "Redirecting...",
        timer: 1500,
        showConfirmButton: false
      });

      // ✅ FIX: no need 2 sec delay (UI lag feel hota hai)
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 1500);

    } catch (err) {
      console.log("LOGIN ERROR:", err.response || err.message); // 🔥 debug

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          err.response?.data?.error ||
          err.message ||
          "Invalid credentials",
        timer: 2000,
        showConfirmButton: false
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-500">

      {/* 🔷 NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4">

        <h1
          onClick={() => navigate("/")}
          className="text-white font-bold text-lg cursor-pointer"
        >
          CampusResolve
        </h1>

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-white bg-white/20 px-3 py-1 rounded-lg"
        >
          ← Back
        </button>

      </div>

      {/* 🔷 LOGIN CARD */}
      <div className="flex items-center justify-center px-4">

        <div className="backdrop-blur-lg bg-white/20 p-6 rounded-2xl shadow-xl w-full max-w-sm">
          
          <div className="flex justify-center mb-3">
            <img src={logo} alt="logo" className="w-16 h-16 rounded-full" />
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 rounded-lg bg-white/80"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-2 rounded-lg bg-white/80"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button className="w-full bg-white text-indigo-600 py-2 rounded-lg flex justify-center">
              {loading ? <Spinner /> : "Login"}
            </button>
          </form>

          <p className="text-center text-white mt-4 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-yellow-300 font-semibold">
              Register
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}
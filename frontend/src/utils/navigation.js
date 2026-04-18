import Swal from "sweetalert2";

export const handleProtectedRoute = (navigate, path) => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Please login first",
      timer: 1500,
      showConfirmButton: false
    });

    setTimeout(() => navigate("/login"), 1500);
  } else {
    navigate(path);
  }
};
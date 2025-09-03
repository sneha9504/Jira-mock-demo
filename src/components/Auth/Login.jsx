import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../../store/notificationStore";


// Validation schema using Yup
const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});



const Login = ({ switchToSignup }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const { showNotification } = useNotificationStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const navigate = useNavigate();
  

  const onSubmit = (data) => {
    const UserData = JSON.parse(localStorage.getItem("userData")) || [];

    if (UserData.length > 0) {
      const user = UserData.find(
        (u) =>
          u.username === data.username && u.password === data.password
      );

      if (user) {
      
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/Dashboard", { replace: true });
        showNotification("Login successful!", "success");
      } else {
        showNotification("Invalid username or password", "error");
      }
    } else {
      showNotification("No users found. Please sign up first.", "error");
    }
  };

  return (
   <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
  <h2 className="text-4xl font-light mb-10 text-blue-600 dark:text-blue-400 tracking-wide">Login</h2>
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
  >
    {/* Username Field */}
    <div className="mb-6">
      <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Username</label>
      <input
        {...register("username")}
        className="w-full bg-transparent text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 py-2 px-0 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
      />
      {errors.username && (
        <p className="text-red-500 text-sm mt-1">
          {errors.username.message}
        </p>
      )}
    </div>

    {/* Password Field */}
    <div className="mb-8">
      <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">Password</label>
      <input
        type="password"
        autoComplete="password"
        {...register("password")}
        className="w-full text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-gray-600 py-2 px-0 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
      />
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">
          {errors.password.message}
        </p>
      )}
    </div>

    {/* Buttons */}
    <div className="flex flex-wrap gap-4 justify-between">
      <button
        type="button"
        onClick={switchToSignup}
        className="px-5 py-2.5 text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign Up
      </button>
      <button
        type="submit"
        className="px-5 py-2.5 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Login
      </button>
    </div>
  </form>
</div>

  );
};

export default Login;

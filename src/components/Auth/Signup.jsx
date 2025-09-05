import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import useNotificationStore from "../../store/notificationStore";

// Signup Form Schema
const signupSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignupForm = ({ switchToLogin }) => {
  const { showNotification } = useNotificationStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  let getUserData = JSON.parse(localStorage.getItem("userData")) || [];

  const onSubmit = (data) => {
    const uniqueId = new Date();

    // ✅ Always fetch fresh user data
    const getUserData = JSON.parse(localStorage.getItem("userData")) || [];

    // ✅ Remove confirmPassword before saving
    const { confirmPassword, ...userDetails } = data;

    const newUser = {
      ...userDetails,
      id: uniqueId.getTime(),
    };

    // ✅ Check if user already exists (username OR email)
    if (
      getUserData.some(
        (u) => u.username === data.username || u.email === data.email
      )
    ) {
      
      showNotification("User already exists!", "error");
      return;
    }

    // ✅ Add new user and update localStorage
    const updatedUsers = [...getUserData, newUser];
    localStorage.setItem("userData", JSON.stringify(updatedUsers));
    
    // ✅ Success notification
    showNotification("Signup successful! Please login.", "success");
  };



  return (
    <div className="flex flex-col items-center justify-center w-full min-h rounded-2xl p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <h2 className="text-2xl sm:text-4xl font-light mb-6 sm:mb-10 text-blue-600 dark:text-blue-400 tracking-wide">
        Sign Up
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {/* Username */}
        <div className="mb-4 sm:mb-6">
          <input
            {...register("username")}
            placeholder="Username"
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 py-2 px-0 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4 sm:mb-6">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 py-2 px-0 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4 sm:mb-6">
          <input
            type="password"
            autoComplete="new-password"
            {...register("password")}
            placeholder="Password"
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 py-2 px-0 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6 sm:mb-8">
          <input
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 py-2 px-0 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-between">
          <button
            type="button"
            onClick={switchToLogin}
            className="px-4 sm:px-5 py-2 text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
          <button
            type="submit"
            className="px-4 sm:px-5 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>

  );
};

export default SignupForm;

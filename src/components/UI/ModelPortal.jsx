import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../../store/notificationStore";

// Schema for validation
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  type: yup.string().required("Type is required"),
});

const ModelPortal = ({ onClose }) => {
  const { showNotification } = useNotificationStore();
  const navigate = useNavigate();
  // Hook-form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Watch form fields for dynamic URL generation
  const name = watch("name", "");
  const type = watch("type", "");

  // Dynamic URL based on form fields
  const dynamicUrl = `/project/${type || "type"}/${name || "name"}`;

  // Fetch userID from localStorage
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userObj.id || "";

  // Handle save to localStorage
  const onSubmit = (data) => {
    // Read previous projectData
    const prevData = JSON.parse(localStorage.getItem("projectData") || "[]");
    const newEntry = {
      ...data,
      userId,
      createdAt: new Date().toISOString(),
    };

    // Save updated data in localStorage
    localStorage.setItem("projectData", JSON.stringify([...prevData, newEntry]));
      window.dispatchEvent(new Event("storage-update"));
    showNotification("Project saved successfully!", "success");
    setTimeout(() => navigate("/dashboard/overview", { replace: true }), 300);
    onClose();


    
  };

  return ReactDOM.createPortal(
    <div
  className="bg-black/60 fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
  onClick={(e) => e.stopPropagation()}
>
  <form
    className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl shadow-2xl max-w-md w-full flex flex-col gap-4 sm:gap-6 border border-gray-200 dark:border-gray-700 overflow-y-auto"
    onSubmit={handleSubmit(onSubmit)}
  >
    {/* Project Name */}
    <label className="flex flex-col gap-1">
      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
        Project Name:
      </span>
      <input
        {...register("name")}
        className="border border-gray-300 dark:border-gray-600 rounded-md px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow duration-200"
      />
      {errors.name && (
        <span className="text-red-500 text-xs sm:text-sm mt-1">
          {errors.name.message}
        </span>
      )}
    </label>

    {/* Project Type */}
    <label className="flex flex-col gap-1">
      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
        Project Type:
      </span>
      <input
        {...register("type")}
        className="border border-gray-300 dark:border-gray-600 rounded-md px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow duration-200"
      />
      {errors.type && (
        <span className="text-red-500 text-xs sm:text-sm mt-1">
          {errors.type.message}
        </span>
      )}
    </label>

    {/* Dynamic URL */}
    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
      <strong>Dynamic URL: </strong>
      {dynamicUrl}
    </div>

    {/* Buttons */}
    <button
      type="submit"
      className="bg-blue-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Save
    </button>
    <button
      type="button"
      className="bg-gray-500 dark:bg-gray-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md shadow hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      onClick={onClose}
    >
      Close
    </button>
  </form>
</div>
,
    document.getElementById("modalPortal")
  );
};

export default ModelPortal;

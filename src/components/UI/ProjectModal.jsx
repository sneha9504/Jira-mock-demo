import React, { useState } from "react";
import ReactDOM from "react-dom";

const ProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [project, setProject] = useState({
    name: "",
    description: "",
    status: "Pending"
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(project);
    
    onClose(); // Close the modal
  };

  return ReactDOM.createPortal(
<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md relative shadow-2xl border border-gray-200 dark:border-gray-700">
    <button
      className="absolute top-3 right-4 text-2xl font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
      onClick={onClose}
    >
      &times;
    </button>

    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">Create Project</h2>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300 text-sm">Project Name</label>
        <input
          type="text"
          name="name"
          value={project.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow duration-200"
        />
      </div>

      <div>
        <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300 text-sm">Description</label>
        <textarea
          name="description"
          value={project.description}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow duration-200 resize-y min-h-[100px]"
        />
      </div>

      <div>
        <label className="block mb-1.5 font-medium text-gray-700 dark:text-gray-300 text-sm">Status</label>
        <select
          name="status"
          value={project.status}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow duration-200"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2.5 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create
      </button>
    </form>
  </div>
</div>,
document.getElementById("modal-root")

    
  );
};

export default ProjectModal;

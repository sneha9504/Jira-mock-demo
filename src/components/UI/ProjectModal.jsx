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
    <div className="fixed inset-0 z-50 bg-gray bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-[400px] relative shadow-lg">
        <button
          className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Create Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Project Name</label>
            <input
              type="text"
              name="name"
              value={project.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={project.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={project.status}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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

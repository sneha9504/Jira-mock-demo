import React, { useEffect, useState } from "react";
import ModelPortal from "../UI/ModelPortal";
import { Link } from "react-router-dom";

const ProjectOverview = () => {
  const [openPortal, setOpenPortal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editProject, setEditProject] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("projectData")) || [];
    setProjects(data);
  }, []);

  // Filter projects created by the logged-in user
  const userProjects = projects.filter((pr) => pr.userId === user?.id);

  const handleCreate = () => {
    setEditProject(null);
    setOpenPortal(true);
  };

  // Handle Edit
  const handleEdit = (project) => {
    setEditProject(project);
    setOpenPortal(true);
  };

  // Handle Delete with confirmation
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (confirmDelete) {
      const updatedProjects = projects.filter((p) => p.createdAt !== id);
      setProjects(updatedProjects);
      localStorage.setItem("projectData", JSON.stringify(updatedProjects));
    }
  };

  // Update project after edit
  const handleSave = (updatedProject) => {
    if (editProject) {
      // Editing existing project
      const updatedProjects = projects.map((p) =>
        p.createdAt === editProject.createdAt ? updatedProject : p
      );
      setProjects(updatedProjects);
      localStorage.setItem("projectData", JSON.stringify(updatedProjects));
    } else {
      // Creating new project
      const newProjects = [...projects, updatedProject];
      setProjects(newProjects);
      localStorage.setItem("projectData", JSON.stringify(newProjects));
    }
    setOpenPortal(false);
    setEditProject(null);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          My Projects
        </h1>
        <button
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
          onClick={handleCreate}
        >
          Create Project
        </button>
      </div>

      {/* Modal for create/edit project */}
      {openPortal && (
        <ModelPortal
          onClose={() => {
            setOpenPortal(false);
            setEditProject(null);
          }}
          onSave={handleSave}
          editProject={editProject} // Pass project if editing
        />
      )}

      {/* Projects Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-4 text-left text-gray-700 font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="p-4 text-left text-gray-700 font-semibold uppercase tracking-wider">
                Type
              </th>
              <th className="p-4 text-left text-gray-700 font-semibold uppercase tracking-wider">
                Created By
              </th>
              <th className="p-4 text-left text-gray-700 font-semibold uppercase tracking-wider">
                Project URL
              </th>
              <th className="p-4 text-center text-gray-700 font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {userProjects.length > 0 ? (
              userProjects.map((project, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-blue-50 transition duration-200 ease-in-out"
                >
                  {/* Project Name */}
                  <td className="p-4 text-blue-600 font-medium">{project.name}</td>

                  {/* Project Type */}
                  <td className="p-4 text-gray-600">{project.type}</td>

                  {/* Project Creator */}
                  <td
                    className="p-4 flex items-center gap-3"
                    title={user?.name || "Unknown"}
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold select-none shadow-sm"
                      aria-label={user?.name ? `Created by: ${user.name}` : "No user"}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : "NA"}
                    </div>
                    <span className="text-gray-700">{user?.name || "Unknown"}</span>
                  </td>

                  {/* Details Link */}
                  <td className="p-4 text-blue-600 font-medium">
                    <Link
                      to={`/Dashboard/${project.createdAt}`}
                      className="hover:underline transition-colors duration-200"
                    >
                      Details
                    </Link>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(project)}
                        className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.createdAt)}
                        className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 p-6 font-medium"
                >
                  No projects found. Create your first project!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectOverview;

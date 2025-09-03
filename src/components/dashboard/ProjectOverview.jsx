import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModelPortal from "../UI/ModelPortal"; // Import your modal component

const ProjectOverview = () => {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [showModal, setShowModal] = useState(false); // ✅ Modal visibility state

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("projectData")) || [];
    setProjects(data);
  }, []);

  const userProjects = projects.filter((pr) => pr.userId === user?.id);

  const handleEditClick = (project) => {
    setEditingId(project.createdAt);
    setEditedName(project.name);
  };

  const handleSave = (id) => {
    const updatedProjects = projects.map((p) =>
      p.createdAt === id ? { ...p, name: editedName } : p
    );
    setProjects(updatedProjects);
    localStorage.setItem("projectData", JSON.stringify(updatedProjects));
    setEditingId(null);
    setEditedName("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter((p) => p.createdAt !== id);
      setProjects(updatedProjects);
      localStorage.setItem("projectData", JSON.stringify(updatedProjects));
    }
  };

  // ✅ Open modal
  const handleCreate = () => {
    setShowModal(true);
  };

  // ✅ Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen overflow-auto">
      {/* Header with Create Button */}
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

      {/* Table */}
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
              userProjects.map((project) => (
                <tr key={project.createdAt} className="border-b border-gray-200">
                  <td className="p-4">
                    {editingId === project.createdAt ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span className="text-blue-600 font-medium">
                        {project.name}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600">{project.type}</td>
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold select-none shadow-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "NA"}
                    </div>
                    <span className="text-gray-700">{user?.name || "Unknown"}</span>
                  </td>
                  <td className="p-4 text-blue-600 font-medium">
                    <Link
                      to={`/Dashboard/${project.createdAt}`}
                      className="hover:underline transition-colors duration-200"
                    >
                      Details
                    </Link>
                  </td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    {editingId === project.createdAt ? (
                      <>
                        <button
                          onClick={() => handleSave(project.createdAt)}
                          className="px-4 py-1 bg-green-500 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-1 bg-gray-400 text-white rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(project)}
                          className="px-4 py-1 bg-yellow-400 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.createdAt)}
                          className="px-4 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 p-6 font-medium">
                  No projects found. Create your first project!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal Integration */}
      {showModal && <ModelPortal onClose={handleCloseModal} />}
    </div>
  );
};

export default ProjectOverview;

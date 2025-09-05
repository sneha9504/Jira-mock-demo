import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModelPortal from "../UI/ModelPortal"; // Import your modal component
import useNotificationStore from "../../store/notificationStore";

const ProjectOverview = () => {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const { showNotification } = useNotificationStore();

  const userData = JSON.parse(localStorage.getItem("userData")) || [];

  // Load projects initially & listen to updates from modal
  useEffect(() => {
    const loadProjects = () => {
      const data = JSON.parse(localStorage.getItem("projectData")) || [];
      setProjects(data);
    };

    loadProjects();
    window.addEventListener("storage-update", loadProjects);

    return () => window.removeEventListener("storage-update", loadProjects);
  }, []);

  // Filter only projects created by logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userProjects = projects.filter((pr) => pr.userId === loggedInUser?.id);

  // Edit handlers
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
    showNotification("Project updated successfully!", "success");
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
      window.dispatchEvent(new Event("storage-update"));
      showNotification("Project deleted successfully!", "success");
    }
  };

  // Modal handlers
  const handleCreate = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen overflow-auto">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
      My Projects
    </h1>
    <button
      className="px-4 sm:px-5 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
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
          <th className="p-3 sm:p-4 text-left text-gray-700 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            Name
          </th>
          <th className="p-3 sm:p-4 text-left text-gray-700 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            Type
          </th>
          <th className="p-3 sm:p-4 text-left text-gray-700 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            Created By
          </th>
          <th className="p-3 sm:p-4 text-left text-gray-700 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            Project URL
          </th>
          <th className="p-3 sm:p-4 text-center text-gray-700 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {userProjects.length > 0 ? (
          userProjects.map((project) => {
            // Find project owner info
            const owner = userData.find((u) => u.id === project.userId);
            return (
              <tr key={project.createdAt} className="border-b border-gray-200">
                <td className="p-3 sm:p-4">
                  {editingId === project.createdAt ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="text-blue-600 font-medium">{project.name}</span>
                  )}
                </td>
                <td className="p-3 sm:p-4 text-gray-600">{project.type}</td>
                <td className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold select-none shadow-sm">
                    {owner?.username
                      ? owner.username.charAt(0).toUpperCase()
                      : "NA"}
                  </div>
                  <span className="text-gray-700">
                    {owner?.username || "Unknown"}
                  </span>
                </td>
                <td className="p-3 sm:p-4 text-blue-600 font-medium">
                  <Link
                    to={`/Dashboard/${project.createdAt}`}
                    className="hover:underline transition-colors duration-200"
                  >
                    Details
                  </Link>
                </td>
                <td className="p-3 sm:p-4 text-center flex justify-center gap-2">
                  {editingId === project.createdAt ? (
                    <>
                      <button
                        onClick={() => handleSave(project.createdAt)}
                        className="px-3 sm:px-4 py-1 bg-green-500 text-white rounded text-xs sm:text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 sm:px-4 py-1 bg-gray-400 text-white rounded text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(project)}
                        className="px-3 sm:px-4 py-1 bg-yellow-400 text-white rounded text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.createdAt)}
                        className="px-3 sm:px-4 py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={5} className="text-center text-gray-500 p-4 sm:p-6 font-medium">
              No projects found. Create your first project!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Modal */}
  {showModal && <ModelPortal onClose={handleCloseModal} />}
</div>

  );
};

export default ProjectOverview;

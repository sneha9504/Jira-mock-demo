import React, { useState, useEffect } from "react";

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(savedProjects);
  }, []);

  // ✅ Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // ✅ Handle Edit Click
  const handleEditClick = (id, currentName) => {
    setEditId(id);
    setEditName(currentName);
  };

  // ✅ Handle Save
  const handleSave = (id) => {
    const updatedProjects = projects.map((project) =>
      project.id === id ? { ...project, name: editName } : project
    );
    setProjects(updatedProjects);
    setEditId(null);
  };

  // ✅ Handle Cancel
  const handleCancel = () => {
    setEditId(null);
    setEditName("");
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 text-left">Project Name</th>
          <th className="p-2 text-left">Lead</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id} className="border-b">
            <td className="p-2">
              {editId === project.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                <span>{project.name}</span>
              )}
            </td>
            <td className="p-2 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold select-none shadow-sm"
              >
                {project.lead?.initials || "NA"}
              </div>
              <span className="text-gray-700">{project.lead?.name || "Unknown"}</span>
            </td>
            <td className="p-2">
              {editId === project.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(project.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEditClick(project.id, project.name)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectTable;

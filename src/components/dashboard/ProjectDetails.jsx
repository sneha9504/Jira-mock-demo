"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import KanbanBoard from "../tasks/KanbanBoard";

const toKey = (label) => {
  const base = String(label || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "column";
};

const ProjectDetails = () => {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [columns, setColumns] = useState([]);

  const loadProjects = () =>
    JSON.parse(localStorage.getItem("projectData")) || [];
  const saveProjects = (projects) =>
    localStorage.setItem("projectData", JSON.stringify(projects));

  const persistProject = (updatedProject) => {
    const projects = loadProjects();
    const next = projects.map((p) =>
      p.createdAt === updatedProject.createdAt ? updatedProject : p
    );
    saveProjects(next);
  };

  const refreshProject = useCallback(() => {
    const projects = loadProjects();
    const found = projects.find((p) => p.createdAt === id) || null;

    if (found) {
      if (!Array.isArray(found.columns) || found.columns.length === 0) {
        found.columns = [
          { id: "col-todo", name: "TO DO List", key: "todo" },
          { id: "col-inprogress", name: "In Progress", key: "inprogress" },
          { id: "col-done", name: "Done", key: "done" },
        ];
        persistProject(found);
      }
      setColumns(found.columns);
    }
    setProject(found);
  }, [id]);

  useEffect(() => {
    refreshProject();
    const storedTasks = JSON.parse(localStorage.getItem(`tasks-${id}`)) || [];
    setTasks(storedTasks);
    setCurrentUser(JSON.parse(localStorage.getItem("user")) || null);
  }, [id, refreshProject]);

  const statusOrder = columns.map((c) => c.key);

  const moveTask = (taskId, direction) => {
    if (!statusOrder.length) return;
    const updated = tasks.map((task) => {
      if (task.id === taskId) {
        const currentIndex = statusOrder.indexOf(task.status);
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < statusOrder.length) {
          return { ...task, status: statusOrder[newIndex] };
        }
      }
      return task;
    });
    setTasks(updated);
    localStorage.setItem(`tasks-${id}`, JSON.stringify(updated));
  };

  const addTask = (status) => {
    const content = prompt(`Enter task for ${status.toUpperCase()}:`);
    if (!content) return;
    const newTask = {
      id: Date.now().toString(),
      content,
      status,
      assigneeId: null,
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem(`tasks-${id}`, JSON.stringify(updated));
  };

  const onUpdateTask = (updatedTask) => {
    const existing = tasks.find((t) => t.id === updatedTask.id);
    if (!existing) return;
    const merged = { ...existing, ...updatedTask };
    const newTasks = tasks.map((t) => (t.id === merged.id ? merged : t));
    setTasks(newTasks);
    localStorage.setItem(`tasks-${id}`, JSON.stringify(newTasks));
  };

  let userRole = "viewer";
  if (project && currentUser) {
    if (project.userId === currentUser.id) userRole = "admin";
    else userRole =
      project.members?.find((m) => m.userId === currentUser.id)?.role ||
      "viewer";
  }

  if (!project)
    return <div className="p-6 text-red-600">Project not found</div>;

  const members = project.members || [];
  const users = JSON.parse(localStorage.getItem("userData")) || [];
  const usernameById = (uid) => users.find((u) => u.id === uid)?.username || `User ${uid}`;

  const canAddMembers = userRole === "admin";
  const canManageColumns = userRole === "admin";
  const canAddTasks = userRole === "admin" || userRole === "editor";

  // Add Column
  const handleAddColumn = () => {
    if (!canManageColumns) return;
    const name = prompt("Enter new column name:");
    if (!name) return;

    const trimmedName = name.trim();
    const isDuplicate = columns.some(
      (col) => col.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      alert("A column with this name already exists!");
      return;
    }

    const existingKeys = new Set(columns.map((c) => c.key));
    let keyBase = toKey(trimmedName);
    let key = keyBase;
    let n = 2;
    while (existingKeys.has(key)) key = `${keyBase}-${n++}`;

    const newCol = { id: `col-${Date.now()}`, name: trimmedName, key };
    const nextCols = [...columns, newCol];
    setColumns(nextCols);

    const updatedProject = { ...project, columns: nextCols };
    setProject(updatedProject);
    persistProject(updatedProject);
  };
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(`tasks-${id}`, JSON.stringify(updatedTasks));
  };

  // Rename Column
  const handleRenameColumn = (colId) => {
    if (!canManageColumns) return;
    const col = columns.find((c) => c.id === colId);
    if (!col) return;

    const newName = prompt("Enter new column name:", col.name);
    if (!newName || newName.trim() === col.name) return;

    const shouldChangeKey = confirm(
      "Also change the column key to match the new name? (This will migrate existing tasks to the new key.)"
    );

    let nextCols = columns.map((c) =>
      c.id === colId ? { ...c, name: newName.trim() } : c
    );
    let nextTasks = tasks;

    if (shouldChangeKey) {
      const existingKeys = new Set(columns.filter((c) => c.id !== colId).map((c) => c.key));
      const newKeyBase = toKey(newName);
      let newKey = newKeyBase || col.key;
      let n = 2;
      while (existingKeys.has(newKey)) newKey = `${newKeyBase}-${n++}`;

      nextCols = nextCols.map((c) =>
        c.id === colId ? { ...c, key: newKey } : c
      );
      nextTasks = tasks.map((t) =>
        t.status === col.key ? { ...t, status: newKey } : t
      );

      setTasks(nextTasks);
      localStorage.setItem(`tasks-${id}`, JSON.stringify(nextTasks));
    }

    setColumns(nextCols);

    const updatedProject = { ...project, columns: nextCols };
    setProject(updatedProject);
    persistProject(updatedProject);
  };

  // Delete Column
  const handleDeleteColumn = (columnKey) => {
    if (!canManageColumns) return;

    if (!confirm("Are you sure you want to delete this column and its tasks?"))
      return;

    const filteredTasks = tasks.filter((t) => t.status !== columnKey);
    setTasks(filteredTasks);
    localStorage.setItem(`tasks-${id}`, JSON.stringify(filteredTasks));

    const filteredColumns = columns.filter((c) => c.key !== columnKey);
    setColumns(filteredColumns);

    const updatedProject = { ...project, columns: filteredColumns };
    setProject(updatedProject);

    const projects = JSON.parse(localStorage.getItem("projectData")) || [];
    localStorage.setItem(
      "projectData",
      JSON.stringify(
        projects.map((p) =>
          p.createdAt === project.createdAt ? updatedProject : p
        )
      )
    );
  };

  return (
 <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen overflow-hidden">
  {/* Header */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200">
    <div className="space-y-2">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
        Project Title: {project.name || "Project"}
      </h1>
    </div>

    <div className="flex flex-wrap gap-4">
      <button
        disabled={!canManageColumns}
        className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleAddColumn}
        title={canManageColumns ? "Add a new column" : "Only admins can add columns"}
      >
        + Add Column
      </button>
    </div>
  </div>

  {/* Kanban Board with Horizontal Scrollbar */}
  <div className="overflow-x-auto scrollbar scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-100 dark:scrollbar-thumb-indigo-300 dark:scrollbar-track-indigo-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-indigo-500/20">
    <KanbanBoard
      tasks={tasks}
      statuses={columns}
      moveTask={moveTask}
      addTask={addTask}
      members={members}
      currentUser={currentUser}
      onUpdateTask={onUpdateTask}
      onDeleteTask={handleDeleteTask} // ✅ pass here
      userRole={userRole}
      onRenameColumn={handleRenameColumn}
      onDeleteColumn={handleDeleteColumn}
      projectId={id} // ✅ needed for task deletion in KanbanTask
    />
  </div>
</div>

  );
};

export default ProjectDetails;

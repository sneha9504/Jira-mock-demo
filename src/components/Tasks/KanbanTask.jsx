import React, { useState } from "react";

const KanbanTask = ({
  task,
  moveTask,
  members = [],
  onUpdateTask,
  onDeleteTask,
  userRole,
  projectId,
}) => {
  const [showAssign, setShowAssign] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || "");
  const [editedPriority, setEditedPriority] = useState(task.priority || "Medium");

  const users = JSON.parse(localStorage.getItem("userData")) || [];
  const usernameById = (uid) => users.find((u) => u.id === uid)?.username || `User ${uid}`;
  const assigneeName = task.assigneeId ? usernameById(task.assigneeId) : null;

  // Assign task to a user
  const handleAssign = (userId) => {
    const updatedTask = { ...task, assigneeId: userId };
    onUpdateTask(updatedTask);
    setShowAssign(false);

    // Update localStorage tasks for this project
    const storedTasks = JSON.parse(localStorage.getItem(`tasks-${projectId}`)) || [];
    const updatedTasks = storedTasks.map((t) => (t.id === task.id ? updatedTask : t));
    localStorage.setItem(`tasks-${projectId}`, JSON.stringify(updatedTasks));
  };

  const handleSave = () => {
    const updatedTask = {
      ...task,
      content: editedContent,
      dueDate: editedDueDate,
      priority: editedPriority,
    };
    onUpdateTask(updatedTask);
    setIsEditing(false);

    // Update localStorage tasks
    const storedTasks = JSON.parse(localStorage.getItem(`tasks-${projectId}`)) || [];
    const updatedTasks = storedTasks.map((t) => (t.id === task.id ? updatedTask : t));
    localStorage.setItem(`tasks-${projectId}`, JSON.stringify(updatedTasks));
  };

  const handleDelete = () => {
    const storedTasks = JSON.parse(localStorage.getItem(`tasks-${projectId}`)) || [];
    const updatedTasks = storedTasks.filter((t) => t.id !== task.id);
    localStorage.setItem(`tasks-${projectId}`, JSON.stringify(updatedTasks));
    if (onDeleteTask) onDeleteTask(task.id);
  };

  const onDragStart = (e) => {
    e.dataTransfer.setData("text/task-id", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
   <div
  className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-md hover:shadow-lg cursor-move transition-shadow duration-200"
  draggable
  onDragStart={onDragStart}
>
  {isEditing ? (
    <>
      <input
        type="text"
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full mb-2 sm:mb-3 px-2 sm:px-3 py-1 sm:py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
        placeholder="Task content"
      />
      <div className="mb-2 sm:mb-3">
        <label className="block text-xs sm:text-sm font-medium mb-1">Due Date:</label>
        <input
          type="date"
          value={editedDueDate}
          onChange={(e) => setEditedDueDate(e.target.value)}
          className="w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
        />
      </div>
      <div className="mb-2 sm:mb-3">
        <label className="block text-xs sm:text-sm font-medium mb-1">Priority:</label>
        <select
          value={editedPriority}
          onChange={(e) => setEditedPriority(e.target.value)}
          className="w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="flex gap-2 sm:gap-3">
        <button onClick={handleSave} className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-accent text-white rounded-md">Save</button>
        <button onClick={() => setIsEditing(false)} className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border rounded-md">Cancel</button>
      </div>
    </>
  ) : (
    <>
      <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">{task.content}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Assigned to: {assigneeName || "Yet to be assigned"}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Due Date: {task.dueDate || "Not set"}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Priority: {task.priority || "Medium"}
      </div>
    </>
  )}

  {userRole === "admin" && !isEditing && (
    <div className="mt-2 sm:mt-3 flex gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button onClick={() => setShowAssign(!showAssign)} className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-indigo-600 text-white rounded-md">Assign</button>
      <button onClick={() => setIsEditing(true)} className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-orange-400 text-white rounded-md">Edit</button>
      <button
        onClick={() => window.confirm("Delete task?") && handleDelete()}
        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-red-500 text-white rounded-md"
      >
        Delete
      </button>
    </div>
  )}

  {showAssign && (
    <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
      {users.length ? (
        users.map((u) => (
          <button
            key={u.id}
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => handleAssign(u.id)}
          >
            {u.username}
          </button>
        ))
      ) : (
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No users available</span>
      )}
    </div>
  )}
</div>

  );
};

export default KanbanTask;

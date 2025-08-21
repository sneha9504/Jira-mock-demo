import React, { useState } from "react";

const TaskCard = ({
  task,
  moveTask,
  editTask,
  deleteTask,
  assignUser,
  users,
  currentUser,
  priorities,
  status,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const [editedPriority, setEditedPriority] = useState(task.priority || "Medium");
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || "");

  const handleSave = () => {
    editTask(task.id, {
      content: editedContent,
      description: editedDescription,
      priority: editedPriority,
      dueDate: editedDueDate,
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return 'var(--color-warning)';
      case "Medium": return 'var(--color-secondary)';
      case "Low": return 'var(--color-accent)';
      default: return 'var(--color-text)';
    }
  };

  return (
    <div className="p-3 mb-3 rounded shadow" style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border mb-2 p-1"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full border mb-2 p-1"
            placeholder="Description"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            className="w-full border mb-2 p-1"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            {priorities.map((pri) => (
              <option key={pri} value={pri}>
                {pri}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
            className="w-full border mb-2 p-1"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
          <button
            onClick={handleSave}
            className="text-sm px-2 py-1 rounded"
            style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p className="font-medium" style={{ color: 'var(--color-text)' }}>{task.content}</p>
          {task.description && <p className="text-sm" style={{ color: 'var(--color-text)' }}>{task.description}</p>}
          {task.priority && (
            <p className="text-sm" style={{ color: getPriorityColor(task.priority) }}>Priority: <strong>{task.priority}</strong></p>
          )}
          {task.dueDate && (
            <p className="text-sm" style={{ color: 'var(--color-text)' }}>Due: <strong>{task.dueDate}</strong></p>
          )}
          {task.assignedTo && (
            <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
              Assigned to: <strong>{task.assignedTo}</strong>
            </p>
          )}
        </>
      )}

      <div className="mt-2 flex justify-between">
        <button
          onClick={() => moveTask(task.id, -1)}
          disabled={status === "todo"}
          className="text-sm px-2 py-1 rounded disabled:opacity-40"
          style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        >
          ←
        </button>
        <button
          onClick={() => moveTask(task.id, 1)}
          disabled={status === "done"}
          className="text-sm px-2 py-1 rounded disabled:opacity-40"
          style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        >
          →
        </button>
      </div>

      <div className="mt-2 flex justify-between">
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm px-2 py-1 rounded"
          style={{ backgroundColor: 'var(--color-secondary)', color: '#ffffff' }}
        >
          Edit
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-sm px-2 py-1 rounded"
          style={{ backgroundColor: 'var(--color-warning)', color: '#ffffff' }}
        >
          Delete
        </button>
      </div>

      <div className="mt-2">
        <label className="text-sm font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
          Assign to:
        </label>
        <select
          className="w-full border rounded px-2 py-1 text-sm"
          value={task.assignedTo || ""}
          onChange={(e) => assignUser(task.id, e.target.value)}
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        >
          <option value="">-- Unassign --</option>
          {users
            .filter((user) => !currentUser || user.username !== currentUser.username)
            .map((user, idx) => (
              <option key={idx} value={user.username}>
                {user.username}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default TaskCard;

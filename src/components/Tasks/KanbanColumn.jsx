import React, { useState, useCallback } from "react";
import KanbanTask from "./KanbanTask";

const KanbanColumn = ({
  status, // { id, name, key }
  tasks,
  moveTask,
  addTask,
  members,
  currentUser,
  onUpdateTask,
  onDeleteTask, // callback to delete a task
  userRole,
  onRenameColumn,
  onDeleteColumn, // callback to delete a column
  projectId, // needed for tasks localStorage
}) => {
  const [isOver, setIsOver] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const onDragLeave = () => setIsOver(false);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsOver(false);
      const taskId = e.dataTransfer.getData("text/task-id");
      if (!taskId) return;
      onUpdateTask({ id: taskId, status: status.key });
    },
    [onUpdateTask, status.key]
  );

  const handleDeleteColumn = () => {
    
      onDeleteColumn(status.key);
    
  };

  return (
    <div
  className={`group rounded-xl p-3 sm:p-4 bg-gray-100 border border-gray-200 min-h-48 sm:min-h-64 transition-all duration-200 ${isOver ? "ring-2 ring-blue-500 shadow-md" : "shadow-sm hover:shadow-lg"}`}
  onDragOver={onDragOver}
  onDragLeave={onDragLeave}
  onDrop={onDrop}
>
  <div className="flex items-center justify-between mb-2 sm:mb-3">
    <h3 className="font-bold text-base sm:text-lg text-gray-800 tracking-tight">{status.name}</h3>
    <div className="flex items-center gap-1 sm:gap-2">
      {userRole === "admin" && (
        <>
          <button
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => addTask(status.key)}
          >
            + Add
          </button>
          <button
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => onRenameColumn?.(status.id)}
            title="Rename column"
          >
            Rename
          </button>
          <button
            className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-red-500 text-white rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            onClick={handleDeleteColumn}
          >
            Delete
          </button>
        </>
      )}
    </div>
  </div>

  <div className="space-y-2 sm:space-y-3">
    {tasks.map((t) => (
      <KanbanTask
        key={t.id}
        task={t}
        moveTask={moveTask}
        members={members}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask} // pass down delete callback
        userRole={userRole}
        projectId={projectId} // for localStorage update
      />
    ))}
    {tasks.length === 0 && (
      <div className="text-xs sm:text-sm text-gray-500 italic text-center py-3 sm:py-4">No tasks</div>
    )}
  </div>
</div>

  );
};

export default KanbanColumn;

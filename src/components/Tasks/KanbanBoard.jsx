import React from "react";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = ({
  tasks,
  statuses,
  moveTask,
  addTask,
  members,
  currentUser,
  onUpdateTask,
  onDeleteTask, // new
  userRole,
  onRenameColumn,
  onDeleteColumn, // new
  projectId, // needed for task deletion in localStorage
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 overflow-x-auto">
      {statuses.map((col) => (
        <KanbanColumn
          key={col.key}
          status={col}
          tasks={tasks.filter((t) => t.status === col.key)}
          moveTask={moveTask}
          addTask={addTask}
          members={members}
          currentUser={currentUser}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask} // pass delete callback
          userRole={userRole}
          onRenameColumn={onRenameColumn}
          onDeleteColumn={onDeleteColumn} // pass column delete callback
          projectId={projectId} // for KanbanTask localStorage updates
        />
      ))}
    </div>
  );
};

export default KanbanBoard;

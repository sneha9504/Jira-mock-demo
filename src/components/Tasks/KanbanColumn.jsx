import React from "react";
import TaskCard from "../Tasks/taskCard";

const KanbanColumn = ({
  status,
  tasks,
  addTask,
  moveTask,
  editTask,
  deleteTask,
  assignUser,
  currentUser,
  users,
  priorities,
}) => {
  return (
    <div className="rounded p-4 min-h-[200px]" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold capitalize" style={{ color: 'var(--color-text)' }}>
          {status.replace("inprogress", "In Progress")}
        </h3>
        <button
          onClick={() => addTask(status)}
          className="text-sm px-2 py-1 rounded hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
        >
          + Create
        </button>
      </div>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          moveTask={moveTask}
          editTask={editTask}
          deleteTask={deleteTask}
          assignUser={assignUser}
          currentUser={currentUser}
          users={users}
          priorities={priorities}
          status={status}
        />
      ))}
    </div>
  );
};

export default KanbanColumn;

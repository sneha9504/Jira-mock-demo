import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const statuses = ["todo", "inprogress", "done"];

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(`tasks-${id}`)) || [];
    setTasks(storedTasks);
  }, [id]);

  const moveTask = (taskId, direction) => {
    const updated = tasks.map((task) => {
      if (task.id === taskId) {
        const currentIndex = statuses.indexOf(task.status);
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < statuses.length) {
          return { ...task, status: statuses[newIndex] };
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
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    localStorage.setItem(`tasks-${id}`, JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Kanban Board</h2>

      <div className="grid grid-cols-3 gap-4">
        {statuses.map((status) => (
          <div key={status} className="bg-gray-100 rounded p-4 min-h-[200px]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold capitalize">
                {status.replace("inprogress", "In Progress")}
              </h3>
              <button
                onClick={() => addTask(status)}
                className="text-sm bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                + Create
              </button>
            </div>

            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-3 mb-3 rounded shadow"
                >
                  <p>{task.content}</p>
                  <div className="mt-2 flex justify-between">
                    <button
                      onClick={() => moveTask(task.id, -1)}
                      disabled={status === "todo"}
                      className="text-sm px-2 py-1 bg-gray-300 rounded disabled:opacity-40"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveTask(task.id, 1)}
                      disabled={status === "done"}
                      className="text-sm px-2 py-1 bg-gray-300 rounded disabled:opacity-40"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;

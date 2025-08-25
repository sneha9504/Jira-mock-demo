import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import KanbanColumn from "../Tasks/KanbanColumn";
import useNotificationStore from "../../store/NotificationStore"; 

const PRIORITIES = ["Low", "Medium", "High"];

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [columns, setColumns] = useState([]);
  const { showNotification } = useNotificationStore.getState();

  useEffect(() => {
    const allProjects = JSON.parse(localStorage.getItem("projectData")) || [];
    const selectedProject = allProjects.find((proj) => proj.createdAt === id);
    setProject(selectedProject);

    const storedTasks = JSON.parse(localStorage.getItem(`tasks-${id}`)) || [];
    setTasks(storedTasks);

    const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
    setUsers(allUsers);

    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    setCurrentUser(loginUser);

    const storedColumns =
      JSON.parse(localStorage.getItem(`columns-${id}`)) ||
      ["todo", "inprogress", "done"];
    setColumns(storedColumns);
  }, [id]);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem(`tasks-${id}`, JSON.stringify(updatedTasks));
  };

  const saveColumns = (updatedColumns) => {
    setColumns(updatedColumns);
    localStorage.setItem(`columns-${id}`, JSON.stringify(updatedColumns));
  };

  const addTask = (status) => {
    const taskContent = prompt("Enter task title:");
    if (!taskContent) return;

    const taskDescription = prompt("Enter task description (optional):") || "";

    const newTask = {
      id: Date.now(),
      content: taskContent,
      description: taskDescription,
      status,
      createdAt: new Date().toISOString(),
      assignedTo: "",
      priority: "Medium",
      dueDate: "",
      projectId: id,
    };

    const updated = [...tasks, newTask];
    saveTasks(updated);
  };

  const moveTask = (taskId, direction) => {
    const indexMap = columns.reduce((acc, status, index) => {
      acc[status] = index;
      return acc;
    }, {});

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const currentIndex = indexMap[task.status];
        const newIndex = currentIndex + direction;
        const newStatus = columns[newIndex];
        if (newStatus) {
          return { ...task, status: newStatus };
        }
      }
      return task;
    });

    saveTasks(updatedTasks);
  };

  const editTask = (taskId, updates) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const assignUser = (taskId, username) => {
    editTask(taskId, { assignedTo: username });
  };

  const addColumn = () => {
    const newColumn = prompt("Enter new column name:");
    if (!newColumn) return;

    const columnId = newColumn.toLowerCase().replace(/\s+/g, "-");
    if (columns.includes(columnId)) {
      showNotification("Column already exists", "error");
      return;
    }

    const updatedColumns = [...columns, columnId];
    saveColumns(updatedColumns);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            Project: {project?.name || "Untitled"}
          </h2>

          <button
            onClick={addColumn}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            ➕ Add Column
          </button>
        </div>

        <select className="border px-3 py-2 rounded" defaultValue="">
          <option disabled value="">
            👥 People
          </option>
          {users
            .filter((user) => user.username !== currentUser?.username)
            .map((user, index) => (
              <option key={index} value={user.username}>
                {user.username}
              </option>
            ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            addTask={addTask}
            moveTask={moveTask}
            editTask={editTask}
            deleteTask={deleteTask}
            assignUser={assignUser}
            users={users}
            currentUser={currentUser}
            priorities={PRIORITIES}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;

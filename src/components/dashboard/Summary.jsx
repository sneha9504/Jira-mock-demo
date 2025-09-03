import React, { useState } from "react";

const Summary = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const getProjectsAndTasks = () => {
    const projects = JSON.parse(localStorage.getItem("projectData")) || [];
    const users = JSON.parse(localStorage.getItem("userData")) || [];

    const findUserName = (id) =>
      users.find((u) => u.id === id)?.username || "Unknown";

    let text = "Project Overview:\n\n";

    projects.forEach((project) => {
      text += `📌 Project: ${project.name} (${project.type})\n`;
      text += `👥 Members: ${
        project.members?.map((m) => findUserName(m.userId)).join(", ") ||
        "None"
      }\n`;

      const tasksStorageKey = `tasks-${project.createdAt}`;
      const tasks = JSON.parse(localStorage.getItem(tasksStorageKey)) || [];

      text += tasks.length > 0
        ? `Tasks:\n${tasks
            .map(
              (task) =>
                ` - ${task.content || "Untitled task"} [${task.status}]${
                  task.assigneeId
                    ? ` (Assigned to: ${findUserName(task.assigneeId)})`
                    : ""
                }`
            )
            .join("\n")}\n`
        : "No tasks yet.\n";
      text += "\n";
    });

    return text;
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const rawText = getProjectsAndTasks();
      // Prompt for exact format: project name, then tasks with due date, priority, status
      const inputText = `Summarize the following project overview in this exact format for each project: 
project name : [project name] 
task: [task description] which have due date [due date, e.g., 2 sep 2025] and task has [priority, e.g., low priority].status in [status]

(Repeat for each task, then move to the next project with 'project name: [next name]')

If due date or priority is unknown, use placeholders like 'unknown' or infer reasonably. Data: ${rawText.slice(0, 2000)}`;

      const response = await fetch(
        "https://api-inference.huggingface.co/models/Falconsai/text_summarization",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: inputText,
            parameters: { max_length: 300, min_length: 50 },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug: Check this in console

      setSummary(data[0]?.summary_text || "No summary generated.");
    } catch (err) {
      console.error(err);
      setSummary(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  // Function to render the summary with basic highlighting (e.g., bold project names)
  const renderHighlightedSummary = (text) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("project name :")) {
        return <p key={index}><strong>{line}</strong></p>;
      }
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col items-center justify-start">
  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-6">AI Project Summary</h1>
  <button
    onClick={generateSummary}
    disabled={loading}
    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
  >
    {loading ? (
      <>
        Generating...
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </>
    ) : (
      "Generate AI Summary"
    )}
  </button>

  {summary && (
    <div className="mt-6 w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
      <p>{renderHighlightedSummary(summary)}</p>
    </div>
  )}
</div>

  );
};

export default Summary;

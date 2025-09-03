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
      // Enhanced prompt to guide the model
      const inputText = `Summarize the following project overview by first highlighting each project name in bold (using **Project Name**), then listing their tasks: ${rawText.slice(0, 2000)}`;

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
            parameters: { max_length: 150, min_length: 40 },
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

  // Simple function to render bold text (converts **text** to <strong>text</strong>)
  const renderHighlightedSummary = (text) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">AI Project Summary</h1>
      <button
        onClick={generateSummary}
        disabled={loading}
        className="px-4 py-2 bg-primary text-white rounded-lg"
      >
        {loading ? "Generating..." : "Generate AI Summary"}
      </button>

      {summary && (
        <div className="mt-4 p-4 bg-surface rounded shadow whitespace-pre-line">
          <p>{renderHighlightedSummary(summary)}</p>
        </div>
      )}
    </div>
  );
};

export default Summary;

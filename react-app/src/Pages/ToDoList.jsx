import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";

function ToDoList() {
  const [tasks, setTasks] = useState([""]);
  const [newTask, setNewTask] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [projects, setProjects] = useState([]);

  const addTask = async () => {
    const chosenProject = parseInt(sessionStorage.getItem("chosenProject"));
    axios
      .post("http://localhost:8081/addTask", { newTask, chosenProject })
      .then((response) => {
        fetchProjectData();
        console.log("ah" + response);
      });
    await fetchProjectData();
    setNewTask("");
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete("http://localhost:8081/deleteTask", {
        params: { taskId },
      });

      if (response.data.success) {
        console.log("Task deleted:", response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete the task. Please try again.");
    }
    await fetchProjectData();
  };
  const slashTask = async (taskId) => {
    try {
      const response = await axios.post("http://localhost:8081/slashTask", {
        taskId: taskId,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error updating task:", error);
    }
    await fetchProjectData();
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    const token = sessionStorage.getItem("authToken");
    const chosenProject = parseInt(sessionStorage.getItem("chosenProject"));

    if (!token) {
      console.error("User is not logged in");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8081/getToDoList", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          projectNumber: chosenProject, 
        },
      });

      if (response.data.success) {
        setProjects(response.data.projects);
        console.log("Fetched projects:", response.data.projects);
      } else {
        setError(response.data.message || "Failed to fetch projects");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="to-do-list">
      <button className="foldUp" onClick={() => setShowNav(!showNav)}>
        <GiHamburgerMenu />
      </button>
      <div className={showNav ? "sidenav active" : "sidenav"}>
        <h1>To Do List</h1>
        <div>
          <input
            type="text"
            className="TypeTask"
            placeholder="Enter a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />

          <button className="add-button" onClick={addTask}>
            ADD
          </button>

          <ol>
            {projects.map((project) => (
              <li key={project.toDoListEntryID} className="toDoList-card">
                <span className="text">
                  {project.isSlash == 1 ? (
                    <s>{project.entryContent}</s>
                  ) : (
                    project.entryContent
                  )}
                </span>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(project.toDoListEntryID)}
                >
                  DELETE
                </button>
                <button
                  className="slash-button"
                  onClick={() => slashTask(project.toDoListEntryID)}
                >
                  {project.isSlash == 1 ? "UNDO" : "DONE"}
                </button>
                <hr></hr>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default ToDoList;


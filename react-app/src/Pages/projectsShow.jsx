import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    const token = sessionStorage.getItem("authToken");
    const chosenProject = parseInt(sessionStorage.getItem("chosenProject"));

    if (!token) {
      console.error("User is not logged in");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8081/getProjectInfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          projectNumber: chosenProject,
        },
      });
      if (response.data.success) {
        setProjects(response.data.projects);
      } else {
        console.error(response.data.message || "Failed to fetch projects");
      }
    } catch (err) {
      console.error("Error:", err);
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="leftProject"></div>

      <div className="MainProject">
        <br></br>
        <div className="ContextProject">
          {projects.length > 0 ? (
            <ul>
              {projects.map((project, index) => (
                <li key={index} className="entry-card">
                  <br></br>
                  <h2>{project.title} </h2> | <h3>{project.entryHour}</h3>
                  <p>{project.description}</p>
                  {project.image && (
                    <img
                      src={`data:image/jpeg;base64,${project.image}`}
                      alt={project.name}
                      
                    />
                  )}
                  <br></br>
                  <hr></hr>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <h3>No entries yet</h3>
              <p>Start by adding first one</p>
            </div>
          )}
        </div>
        <br></br>
      </div>
    </div>
  );
}

export default Projects;

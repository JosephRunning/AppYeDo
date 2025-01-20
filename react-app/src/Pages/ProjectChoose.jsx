import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ProjectsChoose() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      console.error("User is not logged in");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8081/chooseProject", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProjects(response.data.projects);
        console.log("Fetched projects:", response.data.projects);
      } else {
        console.error(response.data.message || "Failed to fetch projects");
      }
    } catch (err) {
      console.error("Error fetching project data:", err);
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="leftProject"></div>

      <div className="MainProject2">
        <br></br>
        <div className="ContextProject">
          {projects.length > 0 ? (
            <ul>
              {projects.map((project) => (
                <li key={project.ProjectId} className="project-card">
                  
                    <Link
                      to="/ProjectsEntries"
                      onClick={() =>
                        sessionStorage.setItem(
                          "chosenProject",
                          project.ProjectId
                        )
                      }
                    >
                      <h2>{project.name}</h2> | <h3>{project.createTime}</h3>
                    </Link>
                  
                  <p>{project.description}</p>
                  <br></br>
                  <hr></hr>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">
              <h3>No projects yet</h3>
              <p>Start by adding first one</p>
            </div>
          )}
        </div>
        <br></br>
      </div>
    </div>
  );
}

export default ProjectsChoose;

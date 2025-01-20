import React, { useState } from "react";
import axios from "axios";

function NewProject() {
  const [nameReg, setName] = useState("");
  const [descriptionReg, setDescriptionReg] = useState("");

  const AddProject = async () => {
    const date = new Date();
    const timeNow =
      String(date.getDate()).padStart(2, "0") +
      ":" +
      String(date.getMonth() + 1).padStart(2, "0") +
      ":" +
      date.getFullYear() +
      " " +
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0") +
      ":" +
      String(date.getSeconds()).padStart(2, "0");

    const email = sessionStorage.getItem("email");

    axios.post("http://localhost:8081/addingProject", {
      nameReg,
      timeNow,
      descriptionReg,
      email,
    });
  };
  return (
    <div className="newProject-card">
      <br></br>
      <h2>Add project</h2>
      <hr></hr>
      <form>
        <div>
          <label htmlFor="text">Project name: <br></br></label>
          <input
            type="text"
            placeholder="Enter title"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="text">Project description: <br></br></label>
           <textarea
            placeholder="Enter description"
            onChange={(e) => setDescriptionReg(e.target.value)}
            required
          />
        </div>

        <button className="#" onClick={AddProject}>
        Add
        </button>
      </form>
    </div>
  );
}

export default NewProject;

import React, { useState } from "react";
import axios from "axios";

function TestInsert() {
  const [titleReg, setTitleReg] = useState("");
  const [descriptionReg, setDescriptionReg] = useState("");
  const [imageReg, setImageReg] = useState("");

  const AddImage = async () => {
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
    const formData = new FormData();
    formData.append("image", imageReg);
    const chosenProject = parseInt(sessionStorage.getItem("chosenProject"));
    try {
      const response = await axios.post(
        "http://localhost:8081/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            titleReg: titleReg,
            timeNow: timeNow,
            descriptionReg: descriptionReg,
            chosenProject: chosenProject, // Example number passed in the query
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading the photo:", error);
    }
  };
  const AddEntry = () => {
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
    const chosenProject = parseInt(sessionStorage.getItem("chosenProject"));
    axios.post("http://localhost:8081/addingEntry", {
      titleReg,
      timeNow,
      descriptionReg,
      chosenProject,
    });
  };
  return (
    <div className="insertEntry-card">
      <br></br>
      <h2>Add entry</h2>
      <hr></hr>
      
      <form>
        <div>
          <label htmlFor="title">Entry title: <br></br></label>
          <input
            type="text"
            placeholder="Enter title"
            onChange={(e) => setTitleReg(e.target.value)}
            required
          />
        </div>
        <br></br>
        <div>
          <label htmlFor="description">
            Entry description:<br></br>
          </label>

          <textarea
            placeholder="Enter description"
            onChange={(e) => setDescriptionReg(e.target.value)}
            required
          />
        </div>
        <br></br>

        <div>
          <label for="avatar">Choose an image: </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={(e) => setImageReg(e.target.files[0])}
          />
        </div>

        <button className="#" onClick={imageReg != "" ? AddImage : AddEntry}>
          Add
        </button>
        <br></br>
      </form>
    </div>
  );
}

export default TestInsert;

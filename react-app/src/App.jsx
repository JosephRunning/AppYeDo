import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

import ToDoList from "./Pages/ToDoList.jsx";

import Login from "./Pages/Login.jsx";

import ProjectShow from "./Pages/projectsShow.jsx";
import ProjectsChoose from "./Pages/ProjectChoose.jsx";
import NewProject from "./Pages/newProject.jsx";

import AppStart from "./Pages/start.jsx";

import InsertEntry from "./Pages/insertEntry.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
      <Route
          path="/"
          element={
            <div>
              <AppStart/>
            </div>
          }
        />
        <Route
          path="Login"
          element={
            <div>
              <Login />
            </div>
          }
        />
        <Route
          path="/ProjectsEntries"
          element={
            <div>
              <Header />
              <ToDoList />
              <InsertEntry />
              <ProjectShow />
            </div>
          }
        />
        <Route
          path="/projectChoose"
          element={
            <div>
              <Header />
              <NewProject />
              <ProjectsChoose />
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;

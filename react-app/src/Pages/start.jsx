import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppStart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AppStart();
  }, []);

  const AppStart = () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/projectChoose");
    }
  };

  return <main className="App"></main>;
};

export default AppStart;

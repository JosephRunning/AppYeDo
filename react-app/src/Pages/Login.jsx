import React, { useState } from "react";
import axios from "axios";

import {useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LoginIn = async (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:8081/login", { email, password })

      .then((response) => {
        console.log("dupa" + response);
        if (response.data.massage) {
          console.log(response.data.massage);
        } else {
          const token = response.data.token;
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("email", email);
          navigate("/projectChoose");
        }
        console.log(response);
      });
  };

  return (
    <div className="LoginBody">
      <div className="LoginContainer">
        <div>
          <h1>Login</h1>
          <form>
            <div className="FormGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="FormGroup">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="LoginBTN" onClick={LoginIn}>
              Login
            </button>
          </form>
        </div>
        <br></br>
      </div>
    </div>
  );
}

export default Login;

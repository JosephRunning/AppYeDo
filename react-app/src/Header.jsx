import { Link, useNavigate } from "react-router-dom";
import React, {useState, useEffect} from "react";

function Header() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const intervalID = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);
  function formatTime() {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(
      seconds
    )}`;
  }

  function padZero(number) {
    return (number < 10 ? "0" : "") + number;
  }

  const navigate = useNavigate();
  function Logout() {
    sessionStorage.clear();
    navigate("/login");
  }
  return (
    <div>
      <div className="header">
        <h1>YeDO!<hr></hr></h1>

        <Link to="/projectChoose">Choose a project</Link>
        <span className="clock">{formatTime()}</span>
        <a href="#" onClick={Logout} className="logOut">
          LogOut
        </a>
      </div>
    </div>
  );
}

export default Header;

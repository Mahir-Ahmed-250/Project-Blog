import React from "react";
import {useState} from "react";

import {Link} from "react-router-dom";
import {IoHome} from "react-icons/io5";
import useFirebase from "../../Hooks/useFirebase";

const Login = () => {
  const {loginUser, loading} = useFirebase();
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  const today = new Date();
  const year = today.getFullYear();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (event) => {
    const result = event.target.value;
    setEmail(result);
  };
  const handlePassword = (event) => {
    const result = event.target.value;
    setPassword(result);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(email, password);
  };
  return (
    <>
      {loading ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {/* <Player
            autoplay
            loop
            src={animationData}
            style={{height: "500px", width: "500px"}}
          /> */}
        </div>
      ) : (
        <>
          <br />
          <br />
          <br />
          <center>
            {" "}
            {/* <Title title1="" title2="Admin Login" /> */}
            <Link to="/" style={{cursor: "pointer", textDecoration: "none"}}>
              <span className="logoutBtn">
                <IoHome className="me-1" />
                Home
              </span>
            </Link>
          </center>
          <div className="loginContainer">
            <div>{/* <img src={loginImg} alt="" /> */}</div>
            <div className="loginForm">
              <form onSubmit={handleLogin}>
                <div className="form-outline mb-4">
                  <input
                    type="email"
                    id="form3Example3"
                    className="form-control form-control-lg mb-2 w-100"
                    onChange={handleEmail}
                    required
                    style={{
                      fontFamily: "Raleway",
                    }}
                    placeholder="Admin Email"
                  />
                </div>

                <div className="form-outline">
                  <input
                    className="form-control form-control-lg mb-2 w-100"
                    type={passwordShown ? "text" : "password"}
                    required
                    onChange={handlePassword}
                    style={{
                      fontFamily: "Raleway",
                    }}
                    placeholder="Enter a password"
                  />

                  <input
                    className="form-check-input ms-1"
                    type="checkbox"
                    value=""
                    id="form2Example3"
                    onClick={togglePassword}
                  />
                  <label className="form-check-label ms-4">Show Password</label>
                </div>
                {/* <Button
                  title="Login"
                  width="100px"
                  border="2px solid black"
                  color="black"
                  fontSize="16px"
                /> */}
              </form>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
        </>
      )}
    </>
  );
};

export default Login;

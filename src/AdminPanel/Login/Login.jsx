import React from "react";
import {useState} from "react";
import animationData from "../../Assets/Login.json";
import useFirebase from "../../Hooks/useFirebase";
import Button from "../../Components/Button/Button";
import Title from "../../Components/Title/Title";
import {Player} from "@lottiefiles/react-lottie-player";
import "./Login.css";
import {Link} from "react-router-dom";

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
          <center>
            <Title title="Admin Login" />
          </center>
          <div className="container loginContainer">
            <div>
              <Player
                autoplay
                loop
                src={animationData}
                style={{width: "100%", height: "70vh"}}
              />
            </div>
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
                <Button
                  title="Login"
                  width="300px"
                  border="2px solid black"
                  color="black"
                  fontSize="20px"
                />
              </form>
              <p>
                Don't Have Admin Account?{" "}
                <Link to="/signUp">Create Now!</Link>{" "}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Login;

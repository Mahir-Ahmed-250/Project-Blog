import React, {useState} from "react";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <>
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
                  placeholder="Admin Email"
                />
              </div>

              <div className="form-outline">
                <input
                  className="form-control form-control-lg mb-2 w-100"
                  type={passwordShown ? "text" : "password"}
                  required
                  onChange={handlePassword}
                  placeholder="Enter a password"
                />

                <input
                  className="form-check-input ms-1"
                  type="checkbox"
                  id="form2Example3"
                  onClick={togglePassword}
                />
                <label className="form-check-label ms-4">Show Password</label>
              </div>

              {loading ? (
                <Button
                  title="Processing"
                  width="300px"
                  border="2px solid black"
                  color="black"
                  fontSize="20px"
                />
              ) : (
                <Button
                  title="Login"
                  width="300px"
                  border="2px solid black"
                  color="black"
                  fontSize="20px"
                />
              )}
            </form>
            <p>
              Forgot Password? <Link to="/forgot-password">Reset Here</Link>
            </p>
            <p>
              Don't Have Admin Account?{" "}
              <Link to="/signUp">Create Now!</Link>{" "}
            </p>
          </div>
        </div>
      </>
    </>
  );
};

export default Login;

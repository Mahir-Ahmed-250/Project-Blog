import React, {useState} from "react";
import {Player} from "@lottiefiles/react-lottie-player";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import useFirebase from "../../Hooks/useFirebase";
import animationData from "../../Assets/Forget.json";
import Button from "../../Components/Button/Button";
import Title from "../../Components/Title/Title";
import "./ForgetPassword.css";

const ForgotPassword = () => {
  const {resetPassword, loading} = useFirebase();
  const [email, setEmail] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email.");
    await resetPassword(email);
  };

  return (
    <div className="container">
      <center>
        <Title title="Reset Password" />
      </center>
      <div className="loginContainer">
        <div>
          <Player
            autoplay
            loop
            src={animationData}
            style={{width: "100%", height: "50vh"}}
          />
        </div>
        <div className="loginForm">
          <form onSubmit={handleResetPassword}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="form-control mb-3"
            />

            {loading ? (
              <Button title="Processing..." width="300px" />
            ) : (
              <Button title="Send Reset Link" width="300px" />
            )}
          </form>

          <p>
            Remember your password? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

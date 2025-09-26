import React, {useState} from "react";
import {Player} from "@lottiefiles/react-lottie-player";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import useFirebase from "../../Hooks/useFirebase";
import animationData from "../../Assets/SignUp.json";
import Button from "../../Components/Button/Button";
import Title from "../../Components/Title/Title";
import profileBlankImg from "../../Assets/ProfileImg.png";

import "./SignUp.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [profileUrl, setProfileUrl] = useState(""); // optional ImgBB URL input
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const {signUpUser} = useFirebase();
  const navigate = useNavigate();

  const togglePassword = () => setPasswordShown(!passwordShown);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreviewImg(URL.createObjectURL(file));
      setProfileUrl(""); // clear URL if file selected
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    // Decide whether to use file or URL
    const profileInput =
      profileImg || (profileUrl.trim() ? profileUrl.trim() : null);

    const success = await signUpUser(username, email, password, profileInput);
    setLoading(false);

    if (success) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setProfileImg(null);
      setProfileUrl("");
      setPreviewImg(null);
      navigate("/login");
    }
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
          <Player
            autoplay
            loop
            src={animationData}
            style={{height: "300px", width: "300px"}}
          />
        </div>
      ) : (
        <>
          <center>
            <Title title="Admin Signup" />
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
              <form onSubmit={handleSignUp}>
                {/* Profile Image */}
                <div className="form-outline mb-3 text-center">
                  <label htmlFor="profileImg">
                    <img
                      src={previewImg || profileBlankImg}
                      alt="preview"
                      width="100"
                      height="100"
                      className="rounded-circle border mb-2"
                      style={{cursor: "pointer", objectFit: "cover"}}
                    />
                  </label>
                  <input
                    id="profileImg"
                    type="file"
                    accept="image/*"
                    style={{display: "none"}}
                    onChange={handleImageChange}
                  />
                  <p className="small text-muted">Set Your Profile Picture</p>
                </div>

                {/* Username */}
                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="form-control form-control-lg w-100"
                    placeholder="Enter Username"
                  />
                </div>

                {/* Email */}
                <div className="form-outline mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control form-control-lg w-100"
                    placeholder="Enter Email"
                  />
                </div>

                {/* Password */}
                <div className="form-outline mb-3">
                  <input
                    type={passwordShown ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control form-control-lg w-100"
                    placeholder="Enter Password"
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-outline mb-3">
                  <input
                    type={passwordShown ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control form-control-lg w-100"
                    placeholder="Confirm Password"
                  />
                </div>

                {/* Show Password */}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onClick={togglePassword}
                  />
                  <label className="form-check-label ms-2">Show Password</label>
                </div>

                <Button
                  title="Sign Up"
                  width="300px"
                  border="2px solid black"
                  color="black"
                  fontSize="20px"
                />
              </form>

              <p>
                Already have an account? <Link to="/login">Login Here</Link>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignUp;

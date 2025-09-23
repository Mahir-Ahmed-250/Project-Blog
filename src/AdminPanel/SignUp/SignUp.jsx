import React, {useState} from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import {auth, db} from "../../Hooks/useFirebase";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {Player} from "@lottiefiles/react-lottie-player";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import {Link, useNavigate} from "react-router-dom";
import animationData from "../../Assets/SignUp.json";
import Button from "../../Components/Button/Button";
import Title from "../../Components/Title/Title";
import "./SignUp.css";

const SignUp = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const togglePassword = () => setPasswordShown(!passwordShown);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2️⃣ Update display name in Auth profile
      await updateProfile(user, {displayName: username});

      // 3️⃣ Add user document to Firestore collection "users"

      // inside handleSignUp
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        createdAt: serverTimestamp(),
        emailVerified: user.emailVerified,
      });

      // 4️⃣ Send verification email
      await sendEmailVerification(user);

      // 5️⃣ Notify user
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Verification email sent. Please check your inbox/spam folder.",
        confirmButtonColor: "#3085d6",
      });
      toast.success("Signup successful! Please verify your email.");

      // 6️⃣ Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // 7️⃣ Redirect to login
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message,
        confirmButtonColor: "#d33",
      });
      toast.error(error.message);
    } finally {
      setLoading(false);
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
                Already Have an Account? <Link to="/login">Login Here</Link>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SignUp;

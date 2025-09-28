import React, {useState, useEffect} from "react";
import {Player} from "@lottiefiles/react-lottie-player";
import Title from "../../Components/Title/Title";
import Button from "../../Components/Button/Button";
import profileBlankImg from "../../Assets/ProfileImg.png";
import useFirebase from "../../Hooks/useFirebase";
import animationData from "../../Assets/Loading2.json";

const UpdateProfile = () => {
  const {user, userData, loading, updateUserProfile} = useFirebase();
  const [username, setUsername] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  console.log(user);
  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setPreviewImg(userData.photoURL || null);
    }
  }, [userData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Name cannot be empty");
    await updateUserProfile(user.uid, username, profileImg);
    setProfileImg(null);
  };

  if (loading || !userData) {
    return (
      <div className="container">
        <Player
          autoplay
          loop
          src={animationData}
          style={{height: "80vh", width: "100%"}}
        />
      </div>
    );
  }

  return (
    <div className="container loginContainer">
      <center>
        <Title title="Update Profile" />
      </center>

      <div className="loginForm">
        <form onSubmit={handleUpdate}>
          <div className="form-outline mb-3 text-center">
            <label htmlFor="profileImg">
              <img
                src={previewImg || user.photoURL}
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
            <p className="small text-muted">Click to change profile picture</p>
          </div>

          <div className="form-outline mb-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control form-control-lg w-100"
              placeholder="Enter your name"
            />
          </div>

          <Button title="Update Profile" width="300px" />
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;

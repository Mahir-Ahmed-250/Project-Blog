import React from "react";
import { Navigate } from "react-router-dom";
import useFirebase from "../Hooks/useFirebase";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../Assets/Loading.json";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useFirebase();

  if (loading) {
    return (
      <div>
        <br />
        <Player
          autoplay
          loop
          src={animationData}
          style={{ width: "100%", height: "100vh" }}
        />
      </div>
    );
  }

  if (!user) {
    // লগইন না থাকলে Login পেজে পাঠাবে
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

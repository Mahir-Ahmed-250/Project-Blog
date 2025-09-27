import React from "react";
import { Navigate } from "react-router-dom";
import useFirebase from "../Hooks/useFirebase";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../Assets/Loading.json";

const PrivateRoute = ({ children, allowedRoles = ["user", "admin"] }) => {
  const { user, userData, loading } = useFirebase();

  if (loading || (user && !userData)) {
    return (
      <Player
        autoplay
        loop
        src={animationData}
        style={{ width: "100%", height: "100vh" }}
      />
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(userData?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;

import React from "react";
import {Navigate} from "react-router-dom";
import useFirebase from "../Hooks/useFirebase";
import {Player} from "@lottiefiles/react-lottie-player";
import animationData from "../Assets/Loading.json";

const PrivateRoute = ({children, allowedRoles}) => {
  const {user, userData, loading} = useFirebase();

  if (loading) {
    return (
      <center>
        <Player
          autoplay
          loop
          src={animationData}
          style={{width: "50%", height: "30%"}}
        />
      </center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;

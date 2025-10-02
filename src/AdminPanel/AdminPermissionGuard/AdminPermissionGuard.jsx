import React from "react";
import {Navigate} from "react-router-dom";
import useFirebase from "../../Hooks/useFirebase";
import animationData from "../../Assets/Loading2.json";
import {Player} from "@lottiefiles/react-lottie-player";

const AdminPermissionGuard = ({permissionKey, children}) => {
  const {userData, loading} = useFirebase();

  if (loading)
    return (
      <Player
        autoplay
        loop
        src={animationData}
        style={{width: "100%", height: "100vh"}}
      />
    ); // or a loader

  // Super-admin can access everything
  if (userData?.role === "super-admin") return children;

  // Check if admin has permission
  if (
    userData?.role === "admin" &&
    userData?.permissions?.includes(permissionKey)
  ) {
    return children;
  }

  // Unauthorized
  return <Navigate to="/unauthorized" replace />;
};

export default AdminPermissionGuard;

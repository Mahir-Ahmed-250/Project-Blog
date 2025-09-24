import React from "react";
import { Navigate } from "react-router-dom";
import useFirebase from "../Hooks/useFirebase";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useFirebase();

  if (loading) {
    return <p>Loading...</p>; // এখানে চাইলে লোডার/অ্যানিমেশন দিতে পারো
  }

  if (!user) {
    // লগইন না থাকলে Login পেজে পাঠাবে
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

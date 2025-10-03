import {Player} from "@lottiefiles/react-lottie-player";
import React from "react";
import animationData from "../../Assets/AdminDashboard.json";
import animationData2 from "../../Assets/Loading2.json";
import Title from "../../Components/Title/Title";
import "./AdminDashboard.css";
import {Link} from "react-router-dom";
import useFirebase from "../../Hooks/useFirebase";

const AdminDashboard = () => {
  const {userData, loading} = useFirebase(); // get the user role & permissions

  if (loading)
    return (
      <Player
        autoplay
        loop
        src={animationData2}
        style={{height: "80vh", width: "100%"}}
      />
    );

  // Helper to check if the admin can access a section
  const canAccess = (permKey) =>
    userData?.role === "super-admin" ||
    userData?.permissions?.includes(permKey);

  // ✅ If admin but has no permissions, show UserDashboard instead
  if (
    userData?.role === "admin" &&
    (!userData?.permissions || userData?.permissions.length === 0)
  ) {
    return (
      <>
        {" "}
        <div className="container">
          <div className="row">
            {/* Animation */}
            <div className="col-md-6">
              <div
                style={{
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Player
                  autoplay
                  loop
                  src={animationData}
                  style={{height: "80vh", width: "100%"}}
                />
              </div>
            </div>

            {/* Dashboard Cards */}
            <div className="col-md-6">
              <Title title="Welcome to Admin Panel" />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <h2 className="userWarningText">
                You Don't Have Enough Permission <br />
                Please Contact With Admin
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container">
      <div className="row">
        {/* Animation */}
        <div className="col-md-6">
          <div
            style={{
              height: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Player
              autoplay
              loop
              src={animationData}
              style={{height: "80vh", width: "100%"}}
            />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="col-md-6">
          {userData?.role === "super-admin" ? (
            <Title title="Welcome to Super Admin Panel" />
          ) : (
            <Title title="Welcome to Admin Panel" />
          )}
          <br />
          <br />
          <div className="row">
            {/* Super-admin only */}
            {userData?.role === "super-admin" && (
              <div className="col-md-6">
                <Link to="/createAnAdmin" style={{textDecoration: "none"}}>
                  <div className="adminDashboardCard">Create an Admin</div>
                </Link>
              </div>
            )}

            {/* Permission-based cards */}
            {canAccess("everyday-lifestyle") && (
              <div className="col-md-6">
                <Link
                  to="/adminEverydayLifeStyle"
                  style={{textDecoration: "none"}}>
                  <div className="adminDashboardCard">Everyday Lifestyle</div>
                </Link>
              </div>
            )}

            {canAccess("health-wellness") && (
              <div className="col-md-6">
                <Link
                  to="/adminHealthAndWellness"
                  style={{textDecoration: "none"}}>
                  <div className="adminDashboardCard">Health And Wellness</div>
                </Link>
              </div>
            )}

            {canAccess("event-successful-people") && (
              <div className="col-md-6">
                <Link
                  to="/adminEventAndSuccessfulPeople"
                  style={{textDecoration: "none"}}>
                  <div className="adminDashboardCard">
                    Event and Successful People
                  </div>
                </Link>
              </div>
            )}

            {canAccess("shop") && (
              <div className="col-md-12">
                <Link to="/adminShop" style={{textDecoration: "none"}}>
                  <div className="adminDashboardCard text-center">Shop</div>
                </Link>
              </div>
            )}
            {canAccess("comments") && (
              <div className="col-md-12">
                <Link to="/adminComments" style={{textDecoration: "none"}}>
                  <div className="adminDashboardCard text-center">
                    Manage Comments
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

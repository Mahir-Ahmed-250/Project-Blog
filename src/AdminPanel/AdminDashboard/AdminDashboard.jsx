import {Player} from "@lottiefiles/react-lottie-player";
import React from "react";
import animationData from "../../Assets/AdminDashboard.json";
import animationData2 from "../../Assets/Loading2.json";
import Title from "../../Components/Title/Title";
import "./AdminDashboard.css";
import {Link} from "react-router-dom";
import useFirebase from "../../Hooks/useFirebase";

const AdminDashboard = () => {
  const {userData, loading} = useFirebase(); // get the user role
  if (loading)
    return (
      <Player
        autoplay
        loop
        src={animationData2}
        style={{height: "80vh", width: "100%"}}
      />
    );
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
            <>
              <Title title="Welcome to Super Admin Panel" />
            </>
          ) : (
            <>
              <Title title="Welcome to Admin Panel" />
            </>
          )}
          <br />
          <br />
          <div className="row">
            {/* Only super-admin can see Create Admin */}
            {userData?.role === "super-admin" && (
              <>
                <div className="col-md-6">
                  <Link to="/createAnAdmin" style={{textDecoration: "none"}}>
                    <div className="adminDashboardCard">Create an Admin</div>
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link
                    to="/adminEverydayLifeStyle"
                    style={{textDecoration: "none"}}>
                    <div className="adminDashboardCard">Everyday Lifestyle</div>
                  </Link>
                </div>
                <div className="col-md-6">
                  <div className="adminDashboardCard">Health and Wellness</div>
                </div>
                <div className="col-md-6">
                  <div className="adminDashboardCard">
                    Event and Successful People
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="adminDashboardCard text-center">Shop</div>
                </div>
              </>
            )}
            {userData?.role === "admin" && (
              <>
                <div className="col-md-6">
                  <Link
                    to="/adminEverydayLifeStyle"
                    style={{textDecoration: "none"}}>
                    <div className="adminDashboardCard">Everyday Lifestyle</div>
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link
                    to="/adminHealthAndWellness"
                    style={{textDecoration: "none"}}>
                    <div className="adminDashboardCard">
                      Health And Wellness
                    </div>
                  </Link>
                </div>{" "}
                <div className="col-md-6">
                  <Link
                    to="/adminEventAndSuccessfulPeople"
                    style={{textDecoration: "none"}}>
                    <div className="adminDashboardCard">
                      Event and Successful People
                    </div>
                  </Link>
                </div>
                <div className="col-md-6">
                  <div className="adminDashboardCard ">Shop</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { Player } from "@lottiefiles/react-lottie-player";
import React from "react";
import animationData from "../../Assets/AdminDashboard.json";
import Title from "../../Components/Title/Title";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div
              style={{
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Player
                autoplay
                loop
                src={animationData}
                style={{ height: "80vh", width: "100%" }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <Title title="Welcome to Admin Panel" />
            <br />
            <br />
            <div className="row">
              <div className="col-md-6">
                <div className="adminDashboardCard">Create an Admin</div>
              </div>
              <div className="col-md-6">
                {" "}
                <div className="adminDashboardCard"> Everyday Lifestyle</div>
              </div>
              <div className="col-md-6">
                {" "}
                <div className="adminDashboardCard">Health and Wellness</div>
              </div>
              <div className="col-md-6">
                {" "}
                <div className="adminDashboardCard">
                  Event and Successful People
                </div>
              </div>
              <div className="col-md-12">
                {" "}
                <div className="adminDashboardCard text-center">Shop</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

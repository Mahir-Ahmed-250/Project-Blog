import {Player} from "@lottiefiles/react-lottie-player";
import animationData from "../../Assets/Welcome.json";
import "./UserDashboard.css";

const UserDashboard = () => {
  return (
    <>
      <div className="container">
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
            style={{height: "70vh", width: "100%"}}
          />

          <div>
            <h2 className="userWarningText">
              You Dont Have Enough Permission <br />
              Please Contact With Admin
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

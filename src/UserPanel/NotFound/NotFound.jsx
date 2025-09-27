import React from "react";
import animationData from "../../Assets/Error 404.json";
import { Player } from "@lottiefiles/react-lottie-player";

const NotFound = () => {
  return (
    <>
      <div className="container">
        <div>
          <Player
            autoplay
            loop
            src={animationData}
            style={{ width: "100%", height: "70vh" }}
          />
        </div>
      </div>
    </>
  );
};

export default NotFound;

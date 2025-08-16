import React from "react";
import Title from "../../../Components/Title/Title";
import aboutMe from "../../../Assets/AboutMe.jpg";
import "./HomeAboutMe.css";

const HomeAboutMe = () => {
  return (
    <>
      <Title title="About" title2="Me" />
      <div className="container homeAboutMeContainer">
        <div>
          <h2 className="homeAboutMeText1">Hello!</h2>
          <p className="homeAboutMeText1Desc">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Cupiditate, nisi eius. Delectus vero neque facilis aut autem nostrum
            incidunt, quas, excepturi cumque reiciendis eveniet eius illo ullam
            minus corrupti eaque fugit labore nihil temporibus suscipit quaerat?
            Deserunt architecto unde recusandae, illo obcaecati optio itaque. A
            earum omnis ducimus dolorem soluta.
          </p>
        </div>
        <div>
          <img src={aboutMe} alt="" className="homeAboutMeImg" />
        </div>
        <div>
          <h2 className="homeAboutMeText2">CONNECT WITH ME</h2>
          <div className="homeAboutMeSocialMediaLink ">
            <a
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
              style={{color: "#000000"}}>
              Facebook
            </a>
            <br />
            <br />
            <a
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
              style={{color: "#000000"}}>
              Instagram
            </a>
            <br />
            <br />
            <a
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
              style={{color: "#000000"}}>
              Twitter
            </a>
            <br />
            <br />
            <a
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
              style={{color: "#000000"}}>
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeAboutMe;

import React from "react";
import HomeBanner from "../HomeBanner/HomeBanner";
import HomeBlogs from "../HomeBlog/HomeBlogs/HomeBlogs";
import HomeAboutMe from "../HomeAboutMe/HomeAboutMe";
import HomeContactMe from "../HomeContactMe/HomeContactMe";

const Home = () => {
  return (
    <>
      <HomeBanner />
      <HomeBlogs />
      <HomeAboutMe />
      <HomeContactMe />
    </>
  );
};

export default Home;

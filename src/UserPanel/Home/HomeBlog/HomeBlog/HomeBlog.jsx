import React from "react";

const HomeBlog = ({blog}) => {
  const {blogName, blogImg, blogDate} = blog;
  return (
    <>
      <a
        href={blogName}
        target="_blank"
        rel="noopener noreferrer"
        style={{textDecoration: "none"}}>
        <div className="card mb-5">
          <img src={blogImg} alt={blogName} style={{height: "350px"}} />
          <h4 className="text-center mt-4">{blogName}</h4>
          <p className="text-center">{blogDate}</p>
        </div>
      </a>
    </>
  );
};

export default HomeBlog;

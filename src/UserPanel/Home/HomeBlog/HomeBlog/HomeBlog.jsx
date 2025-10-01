import React from "react";
import {Link} from "react-router-dom";

const HomeBlog = ({blog}) => {
  const {title, coverImage, type, createdAt} = blog;

  // Generate URL based on blog type
  const url = `/blog/${type}/${blog.id}`;

  return (
    <Link to={url} style={{textDecoration: "none", color: "inherit"}}>
      <div className="card mb-5">
        {coverImage && (
          <img
            src={coverImage}
            alt={title}
            style={{height: "350px", objectFit: "cover"}}
          />
        )}
        <h4 className="text-center mt-4">{title}</h4>
        <p className="text-center">
          {createdAt?.toDate
            ? createdAt.toDate().toLocaleDateString()
            : "Unknown date"}
        </p>
      </div>
    </Link>
  );
};

export default HomeBlog;

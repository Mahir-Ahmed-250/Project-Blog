import React from "react";

const BlogContent = ({content}) => {
  // Add allowFullScreen to all iframe tags
  const enhancedContent = content.replace(
    /<iframe /g,
    "<iframe allowFullScreen "
  );

  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{__html: enhancedContent}}
    />
  );
};

export default BlogContent;

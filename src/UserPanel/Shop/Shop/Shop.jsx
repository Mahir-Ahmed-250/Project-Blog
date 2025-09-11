import React from "react";

const Shop = ({ shop }) => {
  const { shopItemName, shopItemImg, shopItemLink, shopItemDescription } = shop;
  return (
    <div className="col-md-12 pe-3 mt-4">
      <a
        href={shopItemLink}
        target="_blank"
        rel="noopener noreferrer"
        className="articleCard"
      >
        <img src={shopItemImg} width="100%" alt="" />
        <p className="articleName">{shopItemName}</p>
        <p className="articleDescription">{shopItemDescription}</p>

        <br />
        <p className="readMore">Click to Read More....</p>
      </a>
    </div>
  );
};

export default Shop;

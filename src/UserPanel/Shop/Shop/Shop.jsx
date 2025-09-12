import React from "react";
import "./Shop.css";

const Shop = ({shop}) => {
  const {shopItemName, shopItemImg, shopItemLink, shopItemDescription} = shop;
  return (
    <>
      <div className="col-md-12 pe-3  h-100">
        <a
          href={shopItemLink}
          target="_blank"
          rel="noopener noreferrer"
          className="shopItemCard">
          <img src={shopItemImg} width="100%" alt="" />
          <p className="shopItemName">{shopItemName}</p>
          <p className="shopItemDescription">{shopItemDescription}</p>
        </a>
      </div>
    </>
  );
};

export default Shop;

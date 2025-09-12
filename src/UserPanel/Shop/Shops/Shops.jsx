import React, {useEffect, useState} from "react";
import "./Shops.css";
import Carousel from "react-multi-carousel";
import Shop from "../Shop/Shop";
import "react-multi-carousel/lib/styles.css";

const Shops = () => {
  const [shops, setshops] = useState([]);

  useEffect(() => {
    fetch("shop.json")
      .then((res) => res.json())
      .then((data) => setshops(data));
  }, []);

  const responsive = {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024,
      },
      items: 4,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 1,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 464,
      },
      items: 2,
      partialVisibilityGutter: 30,
    },
  };
  return (
    <>
      <div className="shopBannerContainer">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1 className="homeBannerTitle">Shop</h1>
      </div>
      <div className="container">
        <div className="row shopContainer ">
          <Carousel
            autoPlay
            autoPlaySpeed={2000}
            centerMode={false}
            containerClassName="container-with-dots"
            dotListClassName=""
            infinite
            minimumTouchDrag={80}
            pauseOnHover
            responsive={responsive}
            rewind={false}
            slidesToSlide={1}
            arrows={true}>
            {shops.map((shop) => (
              <Shop key={shop.id} shop={shop} />
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default Shops;

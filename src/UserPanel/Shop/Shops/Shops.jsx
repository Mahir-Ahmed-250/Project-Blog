import React, {useEffect, useState} from "react";
import "./Shops.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {collection, query, onSnapshot} from "firebase/firestore";
import {Card} from "react-bootstrap";
import {db} from "../../../Hooks/useFirebase";
import {Player} from "@lottiefiles/react-lottie-player";
import animationData from "../../../Assets/Loading2.json";
import animationData2 from "../../../Assets/NoItemFound.json";
import Title from "../../../Components/Title/Title";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "shop"));
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((doc) => list.push({...doc.data(), id: doc.id}));
      setShops(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 4,
      partialVisibilityGutter: 20,
    },
    tablet: {
      breakpoint: {max: 1024, min: 464},
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: {max: 464, min: 0},
      items: 1,
      partialVisibilityGutter: 10,
    },
  };
  if (loading) {
    return (
      <div className="text-center mt-5">
        {" "}
        <Player
          autoplay
          loop
          src={animationData}
          style={{width: "100%", height: "100vh"}}
        />
      </div>
    );
  }
  if (!shops.length) {
    return (
      <div className="text-center mt-5">
        {" "}
        <Player
          autoplay
          loop
          src={animationData2}
          style={{width: "100%", height: "60vh"}}
        />
        <br />
        <Title title="Not Available" />
      </div>
    );
  }
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

      <div className="container py-5">
        {loading ? (
          <Player
            autoplay
            loop
            src={animationData}
            style={{width: "300px", height: "500px"}}
          />
        ) : (
          <Carousel
            autoPlay
            autoPlaySpeed={2500}
            infinite
            pauseOnHover
            responsive={responsive}
            arrows
            showDots={false}>
            {shops.map((shop) => (
              <a
                key={shop.id}
                href={shop.link} // 🔗 Affiliate link from Firestore
                target="_blank"
                rel="noopener noreferrer"
                style={{textDecoration: "none", color: "inherit"}}>
                <Card className="shadow-sm h-100 mx-2 hover-card">
                  <Card.Img
                    variant="top"
                    src={shop.image}
                    alt={shop.name}
                    style={{height: "180px", objectFit: "cover"}}
                  />
                  <Card.Body>
                    <Card.Title className="text-center">{shop.name}</Card.Title>
                    <Card.Text className="text-muted small">
                      {shop.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </a>
            ))}
          </Carousel>
        )}
      </div>
    </>
  );
};

export default Shops;

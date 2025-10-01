import React, {useEffect, useState} from "react";
import {Container, Row, Col, Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import {collection, getDocs, query, orderBy} from "firebase/firestore";
import animationData from "../../../../Assets/Loading2.json";
import animationData2 from "../../../../Assets/NoItemFound.json";
import "./EveryDayLifestyles.css";
import {db} from "../../../../Hooks/useFirebase";
import {Player} from "@lottiefiles/react-lottie-player";
import Title from "../../../../Components/Title/Title";

const EverydayLifestyles = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "everydaylifestyle"),
          orderBy("serial", "asc") // ✅ sort by serial for proper order
        );
        const snapshot = await getDocs(q);
        const blogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="mt-5">
        <Player
          autoplay
          loop
          src={animationData}
          style={{width: "100%", height: "100vh"}}
        />
      </div>
    );
  }

  if (!posts.length) {
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

  const getColSize = (index) => {
    const patternIndex = index % 5;
    if (patternIndex === 0) return 12;
    if (patternIndex === 1 || patternIndex === 2) return 6;
    if (patternIndex === 3) return 4;
    if (patternIndex === 4) return 8;
    return 12;
  };

  return (
    <>
      <div className="everydayLifestyleBannerContainer">
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
        <h1 className="homeBannerTitle">Everyday Life Style</h1>
      </div>

      <Container className="mt-5">
        <Row>
          {posts.map((post, index) => (
            <Col key={post.id} md={getColSize(index)} className="mb-4">
              <Card style={{height: "100%"}}>
                {post.coverImage && (
                  <Card.Img
                    variant="top"
                    src={post.coverImage}
                    alt={post.title}
                    style={{height: "300px", objectFit: "cover"}}
                  />
                )}
                <Card.Body>
                  <Card.Title>
                    <Link
                      to={`/blog/everyday-lifestyle/${post.id}`}
                      style={{textDecoration: "none", color: "#333"}}>
                      {post.title} {/* ✅ no blog number shown */}
                    </Link>
                  </Card.Title>
                  <Card.Text style={{fontSize: "14px", color: "#666"}}>
                    Created:{" "}
                    {post.createdAt?.toDate
                      ? post.createdAt.toDate().toLocaleDateString()
                      : "Unknown date"}
                  </Card.Text>
                  <Card.Text>
                    {post.content.replace(/<[^>]+>/g, "").slice(0, 150)}...
                  </Card.Text>

                  <Button
                    variant="dark"
                    className="w-25"
                    as={Link}
                    to={`/blog/everyday-lifestyle/${post.id}`}>
                    Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default EverydayLifestyles;

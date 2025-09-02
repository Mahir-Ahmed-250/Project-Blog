import React, {useEffect, useState} from "react";
import {Container, Row, Col, Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./EventAndSuccessfulPeoples.css";

const EventAndSuccessfulPeoples = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/everydayLifestyle.json")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  if (posts.length === 0) {
    return <p className="text-center mt-5">Loading posts...</p>;
  }

  // function to decide column size based on repeating pattern
  const getColSize = (index) => {
    const patternIndex = index % 5; // repeat every 5 items
    if (patternIndex === 0) return 12; // 1st, 6th, 11th...
    if (patternIndex === 1 || patternIndex === 2) return 6; // 2nd+3rd, 7th+8th...
    if (patternIndex === 3) return 4; // 4th, 9th...
    if (patternIndex === 4) return 8; // 5th, 10th...
    return 12;
  };

  return (
    <>
      <div className="eventAndSuccessfulPeopleBannerContainer">
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
        <h1 className="homeBannerTitle">Event And Successful People</h1>
      </div>

      <Container className="mt-5">
        <Row>
          {posts.map((post, index) => (
            <Col key={post.slug} md={getColSize(index)} className="mb-4">
              <Card style={{height: "100%"}}>
                {post.cover && (
                  <Card.Img
                    variant="top"
                    src={post.cover}
                    alt={post.title}
                    style={{height: "300px", objectFit: "cover"}}
                  />
                )}
                <Card.Body>
                  <Card.Title>
                    <Link
                      to={`/everyday-lifestyle/${post.slug}`}
                      style={{textDecoration: "none", color: "#333"}}>
                      {post.title}
                    </Link>
                  </Card.Title>
                  <Card.Text style={{fontSize: "14px", color: "#666"}}>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "Unknown date"}{" "}
                    • {post.readingTime ? `${post.readingTime} min read` : "?"}{" "}
                    •{" "}
                    {post.tags && post.tags.length
                      ? post.tags.join(", ")
                      : "No tags"}
                  </Card.Text>
                  <Card.Text>
                    {post.content.replace(/<[^>]+>/g, "").slice(0, 150)}...
                  </Card.Text>
                  <Button
                    variant="primary"
                    as={Link}
                    to={`/blog/everyday-lifestyle/${post.slug}`}>
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

export default EventAndSuccessfulPeoples;

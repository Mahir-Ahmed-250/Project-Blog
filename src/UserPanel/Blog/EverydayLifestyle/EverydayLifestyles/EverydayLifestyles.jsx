import React, {useEffect, useState} from "react";
import {Container, Row, Col, Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./EveryDayLifestyles.css";

const EverydayLifestyles = () => {
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

  // Split posts into groups of 3: first = left, next two = right stacked
  const chunkPosts = [];
  for (let i = 0; i < posts.length; i += 3) {
    chunkPosts.push(posts.slice(i, i + 3));
  }

  return (
    <>
      {/* Banner */}
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
        <h1 className="homeBannerTitle text-center">Everyday Lifestyle</h1>
      </div>
      {/* Grid */}
      <Container>
        {chunkPosts.map((group, groupIndex) => {
          const leftPost = group[0];
          const rightPosts = group.slice(1, 3); // next two posts
          return (
            <Row key={groupIndex} className="mb-4">
              {/* Left Column */}
              <Col md={6} className="mb-4">
                {leftPost && (
                  <Card style={{height: "100%"}}>
                    {leftPost.cover && (
                      <Card.Img
                        variant="top"
                        src={leftPost.cover}
                        alt={leftPost.title}
                        style={{height: "300px", objectFit: "cover"}}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>
                        <Link
                          to={`/everyday-lifestyle/${leftPost.slug}`}
                          style={{textDecoration: "none", color: "#333"}}>
                          {leftPost.title}
                        </Link>
                      </Card.Title>
                      <Card.Text style={{fontSize: "14px", color: "#666"}}>
                        {leftPost.publishedAt
                          ? new Date(leftPost.publishedAt).toLocaleDateString()
                          : "Unknown date"}{" "}
                        •{" "}
                        {leftPost.readingTime
                          ? `${leftPost.readingTime} min read`
                          : "?"}{" "}
                        •{" "}
                        {leftPost.tags && leftPost.tags.length
                          ? leftPost.tags.join(", ")
                          : "No tags"}
                      </Card.Text>
                      <Card.Text>
                        {leftPost.content.replace(/<[^>]+>/g, "")}
                      </Card.Text>
                      <Button
                        className="my-end"
                        variant="primary"
                        as={Link}
                        to={`/everyday-lifestyle/${leftPost.slug}`}>
                        Read More
                      </Button>
                    </Card.Body>
                  </Card>
                )}
              </Col>

              {/* Right Column */}
              <Col md={6}>
                <Row>
                  {rightPosts.map((post) => (
                    <Col key={post.slug} md={12} className="mb-4">
                      <Card style={{height: "100%"}}>
                        {post.cover && (
                          <Card.Img
                            variant="top"
                            src={post.cover}
                            alt={post.title}
                            style={{height: "250px", objectFit: "cover"}}
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
                            •{" "}
                            {post.readingTime
                              ? `${post.readingTime} min read`
                              : "?"}{" "}
                            •{" "}
                            {post.tags && post.tags.length
                              ? post.tags.join(", ")
                              : "No tags"}
                          </Card.Text>
                          <Card.Text>
                            {post.content.replace(/<[^>]+>/g, "").slice(0, 120)}
                            ...
                          </Card.Text>
                          <Button
                            variant="primary"
                            as={Link}
                            to={`/everyday-lifestyle/${post.slug}`}>
                            Read More
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          );
        })}
      </Container>
    </>
  );
};

export default EverydayLifestyles;

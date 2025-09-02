import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {Container, Card, Button} from "react-bootstrap";
import "./EventAndSuccessfulPeople.css"; // css import করুন

const EventAndSuccessfulPeople = () => {
  const {slug} = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch("/everydayLifestyle.json")
      .then((res) => res.json())
      .then((data) => {
        const foundPost = data.find((p) => p.slug === slug);
        setPost(foundPost);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [slug]);

  if (!post) {
    return <p className="text-center mt-5">Loading post...</p>;
  }

  return (
    <Container className="mt-5">
      <Card>
        {post.cover && (
          <Card.Img
            variant="top"
            src={post.cover}
            alt={post.title}
            className="img-fluid"
            style={{
              maxHeight: "400px",
              width: "100%",
              objectFit: "cover",
            }}
          />
        )}
        <Card.Body>
          <h2>{post.title}</h2>
          <p style={{fontSize: "14px", color: "#666"}}>
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString()
              : "Unknown date"}{" "}
            • {post.readingTime ? `${post.readingTime} min read` : "?"} •{" "}
            {post.tags && post.tags.length ? post.tags.join(", ") : "No tags"}
          </p>

          {/* এখানে img ট্যাগগুলো CSS দিয়ে হ্যান্ডেল হবে */}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{__html: post.content}}
          />

          <Button
            as={Link}
            to="/blog/eventAndSuccessfulPeople"
            className="mt-3">
            ← Back to Posts
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventAndSuccessfulPeople;

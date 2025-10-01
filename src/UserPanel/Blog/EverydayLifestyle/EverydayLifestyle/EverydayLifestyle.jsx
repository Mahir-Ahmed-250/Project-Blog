import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {collection, doc, getDoc} from "firebase/firestore";
import {Container, Button} from "react-bootstrap";
import {db} from "../../../../Hooks/useFirebase";
import {Player} from "@lottiefiles/react-lottie-player";
import animationData from "../../../../Assets/Loading2.json";
import BlogContent from "../../BlogContent";

const EverydayLifestyle = () => {
  const {id} = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(collection(db, "everydaylifestyle"), id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog(docSnap.data());
        } else {
          console.log("No such blog!");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

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

  if (!blog) {
    return <p className="text-center mt-5">Blog not found.</p>;
  }

  return (
    <Container className="mt-5">
      <h1>{blog.title}</h1>

      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            margin: "20px 0",
          }}
        />
      )}

      <p style={{color: "#666", fontSize: "14px"}}>
        {blog.createdAt?.toDate
          ? blog.createdAt.toDate().toLocaleDateString()
          : "Unknown date"}
      </p>

      {/* Use BlogContent component */}
      <BlogContent content={blog.content} />

      <Button
        as={Link}
        to="/blog/everydayLifestyle"
        variant="dark"
        className="mb-4">
        ← Back to Blogs
      </Button>
    </Container>
  );
};

export default EverydayLifestyle;

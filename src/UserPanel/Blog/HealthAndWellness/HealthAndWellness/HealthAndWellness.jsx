import React, {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {Link, useParams} from "react-router-dom";
import {db} from "../../../../Hooks/useFirebase";
import {Player} from "@lottiefiles/react-lottie-player";
import animationData from "../../../../Assets/Loading2.json";
import animationData2 from "../../../../Assets/NoItemFound.json";
import BlogContent from "../../BlogContent";
import {Button} from "react-bootstrap";
import Title from "../../../../Components/Title/Title";

const HealthAndWellness = () => {
  const {id} = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "healthandwellness", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog(docSnap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <Player
        autoplay
        loop
        src={animationData}
        style={{width: "100%", height: "100vh"}}
      />
    );
  }

  if (!blog)
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

  return (
    <div className="container mt-5">
      <h1>{blog.title}</h1>

      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          style={{width: "100%", maxHeight: "400px", objectFit: "cover"}}
        />
      )}

      <BlogContent content={blog.content} />

      <Button
        as={Link}
        to="/blog/healthandwellness"
        variant="dark"
        className="mb-4">
        ← Back to Blogs
      </Button>
    </div>
  );
};

export default HealthAndWellness;

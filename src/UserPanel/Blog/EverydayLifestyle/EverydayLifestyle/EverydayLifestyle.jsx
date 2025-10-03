import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {Container, Button, Form, Image} from "react-bootstrap";
import {db} from "../../../../Hooks/useFirebase";
import {Player} from "@lottiefiles/react-lottie-player";
import animationData from "../../../../Assets/Loading2.json";
import animationData2 from "../../../../Assets/NoItemFound.json";
import BlogContent from "../../BlogContent";
import Title from "../../../../Components/Title/Title";
import {getAuth} from "firebase/auth";
import Swal from "sweetalert2";

const EverydayLifestyle = () => {
  const {id} = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "everydaylifestyle", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setBlog(docSnap.data());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Fetch approved comments in realtime
  useEffect(() => {
    if (!id) return;
    const commentsRef = collection(db, "everydaylifestyle", id, "comments");
    const q = query(commentsRef, where("approved", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setComments(list);
    });

    return () => unsubscribe();
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Prevent blank comment
    if (!user) {
      Swal.fire("Error", "You must be logged in to comment!", "error");
      return;
    }
    if (!newComment.trim()) {
      Swal.fire("Error", "Comment cannot be blank!", "error");
      return;
    }

    try {
      await addDoc(collection(db, "everydaylifestyle", id, "comments"), {
        text: newComment,
        uid: user.uid,
        userName: user.displayName || "Anonymous",
        userImage: user.photoURL || null,
        createdAt: serverTimestamp(),
        approved: false, // admin approval required
      });
      setNewComment("");
      Swal.fire(
        "Comment Submitted",
        "Your comment is awaiting admin approval.",
        "success"
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to submit comment", "error");
    }
  };

  if (loading)
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

  if (!blog)
    return (
      <div className="text-center mt-5">
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

      <BlogContent content={blog.content} />

      {/* Comment Section */}
      <div className="mt-5">
        <h4>Comments</h4>
        <hr />
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              style={{borderBottom: "1px solid #ddd", padding: "10px 0"}}>
              <div className="d-flex align-items-center gap-2">
                <Image
                  src={c.userImage || "/default-avatar.png"}
                  roundedCircle
                  width={50}
                  height={50}
                />
                <strong>{c.userName}</strong>
              </div>

              <p className="mt-2" style={{textAlign: "justify"}}>
                {c.text}
              </p>
              <small style={{color: "#666"}}>
                {c.createdAt?.toDate
                  ? `${c.createdAt.toDate().toLocaleDateString()} ${c.createdAt
                      .toDate()
                      .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                  : ""}
              </small>
            </div>
          ))
        )}

        <Form onSubmit={handleCommentSubmit} className="mt-3">
          <Form.Group controlId="commentBox">
            <Form.Control
              as="textarea"
              rows={8}
              placeholder={user ? "Write your comment..." : "Login to comment"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user}
            />
          </Form.Group>
          <Button
            type="submit"
            variant="dark"
            className="mt-2 w-25 p-2"
            disabled={!user}>
            Submit Comment
          </Button>
        </Form>
      </div>

      <Button
        as={Link}
        to="/blog/everydayLifestyle"
        variant="dark"
        className="mb-4 mt-4 me-2 w-25">
        ← Back to Blogs
      </Button>
      {!user && (
        <Button as={Link} to="/login" variant="dark" className="mb-4 mt-4 w-25">
          Login Here
        </Button>
      )}
    </Container>
  );
};

export default EverydayLifestyle;

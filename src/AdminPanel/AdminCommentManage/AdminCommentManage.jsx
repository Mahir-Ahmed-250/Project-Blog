import React, {useEffect, useState} from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {Table, Form, Image} from "react-bootstrap";
import {db} from "../../Hooks/useFirebase";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {Player} from "@lottiefiles/react-lottie-player";
import animationData from "../../Assets/Loading2.json";

// Blog collections
const blogCollections = [
  "everydaylifestyle",
  "healthandwellness",
  "eventandsuccessfulpeople",
];

const AdminCommentManage = () => {
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedBlogType, setSelectedBlogType] = useState("everydaylifestyle");
  const [blogs, setBlogs] = useState([]); // list of blogs for selected type
  const [selectedBlogId, setSelectedBlogId] = useState("");
  const [comments, setComments] = useState([]);

  const auth = getAuth();

  // Listen auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, [auth]);

  // Check super-admin role
  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists() && docSnap.data().role === "super-admin") {
          setIsSuperAdmin(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) checkRole();
  }, [user]);

  // Fetch blogs of selected type
  useEffect(() => {
    if (!isSuperAdmin) return;
    setLoading(true);
    const fetchBlogs = async () => {
      try {
        const snapshot = await getDocs(collection(db, selectedBlogType));
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          title: docSnap.data().title || "Untitled",
        }));
        setBlogs(list);
        setSelectedBlogId(list[0]?.id || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedBlogType, isSuperAdmin]);

  // Fetch comments for selected blog
  useEffect(() => {
    if (!isSuperAdmin || !selectedBlogId) return;
    setLoading(true);
    const commentsRef = collection(
      db,
      selectedBlogType,
      selectedBlogId,
      "comments"
    );
    const unsubscribe = onSnapshot(
      commentsRef,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        list.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
        );
        setComments(list);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedBlogId, selectedBlogType, isSuperAdmin]);

  // Toggle approved
  const handleToggle = async (comment) => {
    try {
      await updateDoc(
        doc(db, selectedBlogType, selectedBlogId, "comments", comment.id),
        {approved: !comment.approved}
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Player
          autoplay
          loop
          src={animationData}
          style={{width: "100%", height: "100vh"}}
        />
      </div>
    );

  if (!isSuperAdmin)
    return (
      <div className="text-center mt-5">
        <h4>Access Denied: Super Admin Only</h4>
      </div>
    );

  return (
    <div className="container mt-5">
      <h3>Admin Panel - Manage Comments</h3>

      {/* Select Blog Type */}
      <Form.Select
        className="mt-3"
        value={selectedBlogType}
        onChange={(e) => setSelectedBlogType(e.target.value)}>
        {blogCollections.map((b) => (
          <option key={b} value={b}>
            {b.charAt(0).toUpperCase() + b.slice(1)}
          </option>
        ))}
      </Form.Select>

      {/* Select Blog */}
      {blogs.length > 0 && (
        <Form.Select
          className="mt-2 mb-3"
          value={selectedBlogId}
          onChange={(e) => setSelectedBlogId(e.target.value)}>
          {blogs.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </Form.Select>
      )}

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No comments found.
              </td>
            </tr>
          ) : (
            comments.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <Image
                      src={c.userImage || "/default-avatar.png"}
                      roundedCircle
                      width={30}
                      height={30}
                    />
                    {c.userName || "Anonymous"}
                  </div>
                </td>
                <td>{c.text}</td>
                <td>
                  {c.createdAt?.toDate
                    ? c.createdAt.toDate().toLocaleString()
                    : ""}
                </td>

                <td>
                  <Form.Check
                    type="switch"
                    id={`approve-${c.id}`}
                    checked={c.approved || false}
                    onChange={() => handleToggle(c)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminCommentManage;

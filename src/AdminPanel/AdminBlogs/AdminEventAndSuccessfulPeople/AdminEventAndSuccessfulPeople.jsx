import React, {useEffect, useState} from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import {Button, Card, Modal, Form} from "react-bootstrap";
import {Editor} from "react-draft-wysiwyg";
import {EditorState, convertToRaw, ContentState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Swal from "sweetalert2";
import animationData from "../../../Assets/Loading2.json";
import {Player} from "@lottiefiles/react-lottie-player";
import {db} from "../../../Hooks/useFirebase";

// Helper: safely create EditorState from HTML
const createEditorStateFromHTML = (html) => {
  if (!html) return EditorState.createEmpty();
  const blocksFromHtml = htmlToDraft(html);
  if (!blocksFromHtml) return EditorState.createEmpty();
  const {contentBlocks, entityMap} = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );
  return EditorState.createWithContent(contentState);
};

const AdminEventAndSuccessfulPeople = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create blog
  const [newEditorState, setNewEditorState] = useState(
    EditorState.createEmpty()
  );
  const [newTitle, setNewTitle] = useState("");
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [newSerial, setNewSerial] = useState(1);
  const [saving, setSaving] = useState(false);

  // Update blog
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [blogTitle, setBlogTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [serial, setSerial] = useState(1);
  const [updating, setUpdating] = useState(false);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "eventandsuccessfulpeople"),
        orderBy("serial", "asc")
      );
      const snapshot = await getDocs(q);
      const blogsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
      setNewSerial(blogsData.length + 1);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Image upload
  const handleImageChange = (e, forUpdate = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (forUpdate) setCoverImage(event.target.result);
      else setNewCoverImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Create new blog
  const handleCreate = async () => {
    if (!newTitle) return Swal.fire("Error", "Title is required", "warning");
    if (!newSerial || newSerial < 1)
      return Swal.fire("Error", "Serial must be positive", "warning");

    setSaving(true);
    const htmlContent = draftToHtml(
      convertToRaw(newEditorState.getCurrentContent())
    );

    try {
      const docRef = await addDoc(collection(db, "eventandsuccessfulpeople"), {
        title: newTitle,
        coverImage: newCoverImage || "",
        content: htmlContent,
        serial: newSerial,
        createdAt: serverTimestamp(),
      });

      Swal.fire("Success", "Blog created successfully", "success");

      const updatedBlogs = [
        {
          id: docRef.id,
          title: newTitle,
          coverImage: newCoverImage,
          content: htmlContent,
          serial: newSerial,
        },
        ...blogs,
      ].sort((a, b) => a.serial - b.serial);

      setBlogs(updatedBlogs);
      setNewTitle("");
      setNewCoverImage(null);
      setNewEditorState(EditorState.createEmpty());
      setNewSerial(updatedBlogs.length + 1);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save blog", "error");
    } finally {
      setSaving(false);
    }
  };

  // Edit blog
  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setBlogTitle(blog.title);
    setCoverImage(blog.coverImage || "");
    setSerial(blog.serial || 1);
    setEditorState(createEditorStateFromHTML(blog.content));
    setModalOpen(true);
  };

  // Update blog
  const handleUpdate = async () => {
    if (!blogTitle) return Swal.fire("Error", "Title is required", "warning");
    if (!serial || serial < 1)
      return Swal.fire("Error", "Serial must be positive", "warning");

    setUpdating(true);
    const htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    try {
      await updateDoc(doc(db, "eventandsuccessfulpeople", currentBlog.id), {
        title: blogTitle,
        coverImage: coverImage || "",
        content: htmlContent,
        serial,
      });

      Swal.fire("Success", "Blog updated successfully", "success");

      const updatedBlogs = blogs
        .map((b) =>
          b.id === currentBlog.id
            ? {...b, title: blogTitle, coverImage, content: htmlContent, serial}
            : b
        )
        .sort((a, b) => a.serial - b.serial);

      setBlogs(updatedBlogs);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update blog", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "eventandsuccessfulpeople", id));
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
        setBlogs(blogs.filter((b) => b.id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  if (loading)
    return (
      <Player
        autoplay
        loop
        src={animationData}
        style={{width: "100%", height: "100vh"}}
      />
    );

  const editorToolbar = {
    options: [
      "inline",
      "blockType",
      "fontSize",
      "fontFamily",
      "list",
      "textAlign",
      "colorPicker",
      "link",
      "emoji",
      "image",
      "embedded",
      "history",
    ],
    image: {
      uploadEnabled: true,
      previewImage: true,
      inputAccept: "image/*",
      uploadCallback: (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve({data: {link: e.target.result}});
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        }),
    },
    embedded: {
      embedCallback: (link) => link,
      defaultSize: {height: "400px", width: "100%"},
    },
  };

  return (
    <div className="container mt-4">
      <h2>Manage Event And Successful People Blogs</h2>
      <hr />

      <div className="row mt-3">
        {blogs.map((blog) => (
          <div key={blog.id} className="col-md-4 mb-4">
            <Card
              style={{
                border: "2px solid #343a40",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}>
              {blog.coverImage && (
                <Card.Img
                  variant="top"
                  src={blog.coverImage}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderBottom: "1px solid #343a40",
                  }}
                />
              )}
              <Card.Body>
                <Card.Title>
                  {blog.serial}. {blog.title}
                </Card.Title>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(blog)}
                  className="me-2">
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(blog.id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Create Blog */}
      <hr />
      <h3>Create New Blog</h3>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Serial</Form.Label>
        <Form.Control
          type="number"
          min={1}
          value={newSerial}
          onChange={(e) => setNewSerial(parseInt(e.target.value))}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Cover Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e)}
        />
        {newCoverImage && (
          <img
            src={newCoverImage}
            alt="Preview"
            className="cover-preview mt-2"
          />
        )}
      </Form.Group>

      <Editor
        editorState={newEditorState}
        onEditorStateChange={setNewEditorState}
        wrapperClassName="editor-wrapper"
        editorClassName="editor-main"
        toolbarClassName="editor-toolbar"
        editorStyle={{
          border: "2px solid #343a40",
          padding: "10px",
          minHeight: "250px",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
        toolbar={editorToolbar}
      />

      <Button
        className="btn btn-dark mt-3"
        onClick={handleCreate}
        disabled={saving}>
        {saving ? "Saving..." : "Save Blog"}
      </Button>

      {/* Update Modal */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Serial</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={serial}
              onChange={(e) => setSerial(parseInt(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, true)}
            />
            {coverImage && (
              <img
                src={coverImage}
                alt="Preview"
                style={{height: "150px", marginTop: "10px", objectFit: "cover"}}
              />
            )}
          </Form.Group>

          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="editor-wrapper"
            editorClassName="editor-main"
            toolbarClassName="editor-toolbar"
            editorStyle={{
              border: "2px solid #343a40",
              padding: "10px",
              minHeight: "250px",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
            toolbar={editorToolbar}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleUpdate} disabled={updating}>
            {updating ? "Updating..." : "Update Blog"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminEventAndSuccessfulPeople;

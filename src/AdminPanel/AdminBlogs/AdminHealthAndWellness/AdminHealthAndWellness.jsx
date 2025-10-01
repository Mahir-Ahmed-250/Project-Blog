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
import Title from "../../../Components/Title/Title";

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

// Compress image to avoid Firestore size limits
const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });

const AdminHealthAndWellness = () => {
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
        collection(db, "healthandwellness"),
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

  // Image upload handler
  const handleImageChange = async (e, forUpdate = false) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressedBase64 = await compressImage(file);
      if (forUpdate) setCoverImage(compressedBase64);
      else setNewCoverImage(compressedBase64);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to process image", "error");
    }
  };

  // Create blog
  const handleCreate = async () => {
    if (!newTitle) return Swal.fire("Error", "Title is required", "warning");
    if (!newSerial || newSerial < 1)
      return Swal.fire("Error", "Serial must be positive", "warning");

    setSaving(true);
    const htmlContent = draftToHtml(
      convertToRaw(newEditorState.getCurrentContent())
    );

    try {
      const docRef = await addDoc(collection(db, "healthandwellness"), {
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
      await updateDoc(doc(db, "healthandwellness", currentBlog.id), {
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

    if (!result.isConfirmed) return;
    try {
      await deleteDoc(doc(db, "healthandwellness", id));
      Swal.fire("Deleted!", "Blog has been deleted.", "success");
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete blog", "error");
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
        compressImage(file).then((base64) => ({data: {link: base64}})),
      defaultSize: {height: "400px", width: "100%"},
    },
    embedded: {
      embedCallback: (link) => link,
      defaultSize: {height: "400px", width: "100%"},
    },
  };

  return (
    <div className="container mt-4">
      <Title title="Manage Health And Wellness Blogs" />
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
                  className="me-2"
                  onClick={() => handleEdit(blog)}>
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
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              marginTop: "10px",
              borderRadius: "8px",
            }}
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

export default AdminHealthAndWellness;

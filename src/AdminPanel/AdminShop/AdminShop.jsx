import React, {useEffect, useState} from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import {Button, Form, Modal, Card, Row, Col} from "react-bootstrap";
import Title from "../../Components/Title/Title";
import {db} from "../../Hooks/useFirebase";
import Swal from "sweetalert2";
import {Player} from "@lottiefiles/react-lottie-player";
import animationData from "../../Assets/Loading2.json";

const AdminShop = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    link: "",
  });

  // Load shops in real-time
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "shop"));
    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((doc) => {
        list.push({...doc.data(), id: doc.id});
      });
      setShops(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Handle text input
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Handle image file -> Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, image: reader.result}); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // Create or update
  const handleSave = async () => {
    try {
      // Normalize affiliate link (add https:// if missing)
      let finalData = {...formData};
      if (finalData.link && !/^https?:\/\//i.test(finalData.link)) {
        finalData.link = "https://" + finalData.link;
      }

      if (editingShop) {
        const shopRef = doc(db, "shop", editingShop.id);
        await updateDoc(shopRef, finalData);
      } else {
        await addDoc(collection(db, "shop"), finalData);
      }
      handleClose();
    } catch (error) {
      console.error("Error saving shop:", error);
    }
  };

  // Delete with SweetAlert2 confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the shop.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "shop", id));
          Swal.fire("Deleted!", "The shop has been removed.", "success");
        } catch (error) {
          console.error("Error deleting shop:", error);
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  // Open modal for edit
  const handleEdit = (shop) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name,
      description: shop.description,
      image: shop.image,
      link: shop.link,
    });
    setShowModal(true);
  };

  // Reset modal
  const handleClose = () => {
    setShowModal(false);
    setEditingShop(null);
    setFormData({name: "", description: "", image: "", link: ""});
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
  return (
    <div className="container">
      <Title title="Manage Shop" />

      {/* Add New Shop Button */}
      <div className="mb-3 text-end">
        <Button onClick={() => setShowModal(true)}>+ Add Shop</Button>
      </div>

      {/* Grid Display */}
      <Row>
        {shops.map((shop) => (
          <Col key={shop.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="shadow h-100">
              <Card.Img
                variant="top"
                src={shop.image}
                height="150"
                style={{objectFit: "cover"}}
              />
              <Card.Body>
                <Card.Title>{shop.name}</Card.Title>
                <Card.Text>{shop.description}</Card.Text>
                {shop.link && (
                  <a
                    href={shop.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary w-100 mb-2">
                    Visit Link
                  </a>
                )}
                <div className="d-flex justify-content-between">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(shop)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(shop.id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingShop ? "Edit Shop" : "Add Shop"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    borderRadius: "5px",
                  }}
                />
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Affiliate Link</Form.Label>
              <Form.Control
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://affiliate-link.com"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingShop ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminShop;

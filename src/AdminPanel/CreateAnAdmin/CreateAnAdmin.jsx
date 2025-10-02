import {Player} from "@lottiefiles/react-lottie-player";
import {useState, useEffect} from "react";
import Title from "../../Components/Title/Title";
import animationData from "../../Assets/UserDashboard.json";
import animationData2 from "../../Assets/Loading2.json";
import {toast} from "react-toastify";
import {db} from "../../Hooks/useFirebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import useFirebase from "../../Hooks/useFirebase";
import {Navigate} from "react-router-dom";
import {Modal, Button, Form, Spinner} from "react-bootstrap";
import Swal from "sweetalert2";

const PERMISSION_OPTIONS = [
  {key: "everyday-lifestyle", label: "Everyday Lifestyle"},
  {key: "health-wellness", label: "Health and Wellness"},
  {key: "event-successful-people", label: "Event & Successful People"},
  {key: "shop", label: "Shop"},
];

const CreateAnAdmin = () => {
  const {user, userData, loading} = useFirebase();
  const [emailInput, setEmailInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [admins, setAdmins] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // 🔹 Live fetch all admins
  useEffect(() => {
    if (!user || !userData) return;

    const adminsRef = collection(db, "users");
    const q = query(adminsRef, where("role", "==", "admin"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAdmins(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})));
    });

    return () => unsubscribe();
  }, [user, userData]);

  // 🔹 Make user admin and ask for permissions
  const handleMakeAdmin = async () => {
    if (!emailInput.trim()) return toast.error("Enter an email address");
    setUpdating(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", emailInput.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("User not found in database");
        setUpdating(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];

      // Assign role first
      await updateDoc(userDoc.ref, {role: "admin", permissions: []});

      // Open modal to select permissions
      setSelectedAdmin({id: userDoc.id, email: userDoc.data().email});
      setSelectedPermissions([]);
      setShowModal(true);

      setEmailInput("");
      toast.success(`${userDoc.data().email} is now an admin!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 Remove admin (with confirmation)
  const handleRemoveAdmin = async (adminId, email) => {
    const result = await Swal.fire({
      title: `Remove ${email}?`,
      text: "This action will revoke admin access.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const userDocRef = doc(db, "users", adminId);
        await updateDoc(userDocRef, {role: "user", permissions: []});
        toast.info(`${email} is now a regular user.`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove admin: " + err.message);
      }
    }
  };

  // 🔹 Open permission modal for existing admin
  const handleOpenPermissions = (admin) => {
    setSelectedAdmin(admin);
    setSelectedPermissions(admin.permissions || []);
    setShowModal(true);
  };

  // 🔹 Toggle checkbox
  const handleTogglePermission = (permKey) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey)
        ? prev.filter((p) => p !== permKey)
        : [...prev, permKey]
    );
  };

  // 🔹 Save permissions
  const handleSavePermissions = async () => {
    if (!selectedAdmin) return;

    try {
      const userDocRef = doc(db, "users", selectedAdmin.id);
      await updateDoc(userDocRef, {permissions: selectedPermissions});
      toast.success(`Permissions updated for ${selectedAdmin.email}`);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update permissions: " + err.message);
    }
  };

  // 🔹 Loading or unauthorized
  if (loading)
    return (
      <Player
        autoplay
        loop
        src={animationData2}
        style={{height: "80vh", width: "100%"}}
      />
    );
  const isUnauthorized = !user || userData?.role !== "super-admin";

  return (
    <>
      {isUnauthorized && <Navigate to="/unauthorized" replace />}

      {!isUnauthorized && (
        <div className="container">
          <div className="row">
            {/* Animation */}
            <div className="col-md-6">
              <Player
                autoplay
                loop
                src={animationData}
                style={{height: "80vh", width: "100%"}}
              />
            </div>

            {/* Form & Admin Table */}
            <div className="col-md-6">
              <Title title="Create An Admin" />
              <br />
              <input
                type="email"
                placeholder="Enter user email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="form-control mb-3"
              />
              <button
                className="btn btn-primary mb-4"
                onClick={handleMakeAdmin}
                disabled={updating}>
                {updating ? "Updating..." : "Make Admin"}
              </button>

              <h5>Current Admins</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Admin Name</th>
                      <th>Permissions</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length > 0 ? (
                      admins.map((admin) => (
                        <tr key={admin.id}>
                          <td>{admin.email}</td>
                          <td>{admin.username}</td>
                          <td>
                            {(admin.permissions || []).length > 0
                              ? admin.permissions.join(", ")
                              : "No permissions"}
                          </td>
                          <td className="d-flex flex-wrap gap-2">
                            <button
                              className="btn btn-warning btn-sm w-100"
                              onClick={() => handleOpenPermissions(admin)}>
                              Set Permissions
                            </button>
                            <button
                              className="btn btn-danger btn-sm w-100"
                              onClick={() =>
                                handleRemoveAdmin(admin.id, admin.email)
                              }>
                              Remove Admin
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          <Spinner />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Permissions Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                Manage Permissions for {selectedAdmin?.email}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {PERMISSION_OPTIONS.map((perm) => (
                  <Form.Check
                    key={perm.key}
                    type="checkbox"
                    id={perm.key} // important for label click
                    label={perm.label}
                    checked={selectedPermissions.includes(perm.key)}
                    onChange={() => handleTogglePermission(perm.key)}
                  />
                ))}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSavePermissions}>
                Save Permissions
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default CreateAnAdmin;

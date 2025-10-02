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
  const [users, setUsers] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // 🔹 Live fetch admins
  useEffect(() => {
    if (!user || !userData) return;

    const adminsRef = collection(db, "users");
    const q = query(adminsRef, where("role", "==", "admin"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAdmins(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})));
    });

    return () => unsubscribe();
  }, [user, userData]);

  // 🔹 Live fetch normal users
  useEffect(() => {
    if (!user || !userData) return;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "user"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})));
    });

    return () => unsubscribe();
  }, [user, userData]);

  // 🔹 Make user admin via email
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
      const userDataFound = userDoc.data();

      // ❌ Prevent making super-admin admin
      if (userDataFound.role === "super-admin") {
        toast.error("You cannot assign admin role to a super-admin!");
        setUpdating(false);
        return;
      }

      // ❌ Prevent re-assigning if already admin
      if (userDataFound.role === "admin") {
        toast.error(`${userDataFound.email} is already an admin!`);
        setUpdating(false);
        return;
      }

      // Assign role first
      await updateDoc(userDoc.ref, {role: "admin", permissions: []});

      // Open modal to select permissions
      setSelectedAdmin({id: userDoc.id, email: userDataFound.email});
      setSelectedPermissions([]);
      setShowModal(true);

      setEmailInput("");
      toast.success(`${userDataFound.email} is now an admin!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 Promote from normal user table
  const handlePromoteUser = async (userObj) => {
    // ❌ Prevent promoting self if super-admin
    if (userObj.role === "super-admin") {
      toast.error("Super-admin cannot promote himself!");
      return;
    }

    // ❌ Prevent promoting if already admin
    if (userObj.role === "admin") {
      toast.error(`${userObj.email} is already an admin!`);
      return;
    }

    try {
      const userDocRef = doc(db, "users", userObj.id);
      await updateDoc(userDocRef, {role: "admin", permissions: []});

      setSelectedAdmin(userObj);
      setSelectedPermissions([]);
      setShowModal(true);

      toast.success(`${userObj.email} is now an admin!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to promote user: " + err.message);
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

  // 🔹 Open permission modal
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

            {/* Form & Admin/User Tables */}
            <div className="col-md-6">
              <Title title="Manage Admins" />
              <br />

              {/* Email input option */}
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

              {/* Current Admins */}
              <h5>Current Admins</h5>
              <div className="table-responsive mb-5">
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
                          No Admin Found!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Normal Users */}
              <h5>Normal Users</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((usr) => (
                        <tr key={usr.id}>
                          <td>{usr.email}</td>
                          <td>{usr.username}</td>
                          <td>
                            {usr.role !== "super-admin" ? (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handlePromoteUser(usr)}>
                                Make Admin
                              </button>
                            ) : (
                              <span className="text-muted">Super Admin</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No User Found!
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
                    id={perm.key}
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

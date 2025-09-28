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

const CreateAnAdmin = () => {
  const {user, userData, loading} = useFirebase();
  const [emailInput, setEmailInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [admins, setAdmins] = useState([]);

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

  // 🔹 Make user admin
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
      await updateDoc(userDoc.ref, {role: "admin"});

      toast.success(`${emailInput} is now an admin!`);
      setEmailInput("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // 🔹 Remove admin (make user)
  const handleRemoveAdmin = async (adminId, email) => {
    try {
      const userDocRef = doc(db, "users", adminId);
      await updateDoc(userDocRef, {role: "user"});
      toast.info(`${email} is now a regular user.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove admin: " + err.message);
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
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Admin Name</th>
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
                          <button
                            className="btn btn-danger btn-sm"
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
                      <td colSpan="3" className="text-center">
                        No admins found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAnAdmin;

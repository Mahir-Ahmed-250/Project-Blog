import {useState, useEffect} from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import initializeFirebase from "../Firebase/firebase.init";
import {toast} from "react-toastify";
import Swal from "sweetalert2";

// Initialize Firebase app once
const firebaseApp = initializeFirebase();

// Initialize services using the app
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const useFirebase = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      if (email?.trim() && password.length) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        if (res.user.emailVerified) {
          Swal.fire("Success", "Logged in successfully!", "success");
        } else {
          Swal.fire(
            "Email not verified",
            "Please verify your email first.",
            "error"
          );
        }
      } else {
        toast.error("Please fill in all required fields!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return {user, loading, loginUser, logOut, db};
};

export {auth, db};
export default useFirebase;

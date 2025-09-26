import {useState, useEffect} from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {getFirestore, doc, setDoc, serverTimestamp} from "firebase/firestore";
import initializeFirebase from "../Firebase/firebase.init";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

// ✅ Initialize Firebase app and services
const firebaseApp = initializeFirebase();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const IMGBB_API_KEY = "596a4581abe4c9848fe42dfc31df31bc"; // 🔹 replace with your ImgBB API key

const useFirebase = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Helper: upload file to ImgBB
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("ImgBB upload failed");
    }
  };

  // 🔹 Signup
  const signUpUser = async (username, email, password, profileFileOrUrl) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      let photoURL = null;

      if (profileFileOrUrl) {
        // Check if it's a File object (from <input type="file">)
        if (profileFileOrUrl instanceof File) {
          photoURL = await uploadToImgBB(profileFileOrUrl);
        } else if (typeof profileFileOrUrl === "string") {
          photoURL = profileFileOrUrl;
        }
      }

      // ✅ Update profile with displayName & photoURL
      await updateProfile(firebaseUser, {displayName: username, photoURL});

      // ✅ Save user to Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,
        username,
        email,
        photoURL: photoURL || null,
        createdAt: serverTimestamp(),
        emailVerified: firebaseUser.emailVerified,
      });

      // ✅ Send verification email
      await sendEmailVerification(firebaseUser);

      // ✅ Log out
      await signOut(auth);

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Verification email sent. Please check your inbox.",
      });

      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      if (!email?.trim() || !password) {
        toast.error("Please fill in all required fields!");
        return;
      }

      const res = await signInWithEmailAndPassword(auth, email, password);

      if (res.user.emailVerified) {
        Swal.fire({
          icon: "success",
          title: "Congratulations",
          text: "Welcome to Admin Panel",
        });
        setUser(res.user);
        navigate("/dashboard");
      } else {
        await signOut(auth);
        Swal.fire({
          icon: "error",
          title: "Email not verified",
          text: "Please verify your email first.",
        });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // 🔹 Auth state observer
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unSubscribe;
  }, []);

  return {user, loading, signUpUser, loginUser, logOut, db};
};

export {auth, db};
export default useFirebase;

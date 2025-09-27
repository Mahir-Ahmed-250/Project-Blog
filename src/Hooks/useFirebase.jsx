import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import initializeFirebase from "../Firebase/firebase.init";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const firebaseApp = initializeFirebase();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const IMGBB_API_KEY = "596a4581abe4c9848fe42dfc31df31bc";

const useFirebase = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // role, etc.
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Upload image
  const uploadToImgBB = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) return data.data.url;
      throw new Error("ImgBB upload failed");
    } catch (err) {
      console.error(err);
      toast.error("Profile picture upload failed");
      return null;
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
      if (profileFileOrUrl instanceof File) {
        photoURL = await uploadToImgBB(profileFileOrUrl);
      } else if (typeof profileFileOrUrl === "string") {
        photoURL = profileFileOrUrl;
      }

      await updateProfile(firebaseUser, { displayName: username, photoURL });

      // Save with role = "user"
      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,
        username,
        email,
        photoURL: photoURL || null,
        role: "admin",
        createdAt: serverTimestamp(),
        emailVerified: firebaseUser.emailVerified,
      });

      await sendEmailVerification(firebaseUser);
      await signOut(auth);
      setUser(null);
      setUserData(null);

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
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (!res.user.emailVerified) {
        await signOut(auth);
        Swal.fire({
          icon: "error",
          title: "Email not verified",
          text: "Please verify your email first.",
        });
        return;
      }

      // ✅ Set Firebase user
      setUser(res.user);

      // ✅ Fetch user data (role)
      const docRef = doc(db, "users", res.user.uid);
      const snap = await getDoc(docRef);
      const data = snap.exists() ? snap.data() : { role: "user" };
      setUserData(data);

      // 🔹 Redirect based on role
      if (data.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/profile", { replace: true }); // new users go here
      }

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Login successful",
        timer: 1500,
        showConfirmButton: false,
      });
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
      setUserData(null);
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  // 🔹 Auth observer
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        setUser(firebaseUser);
        const docRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(docRef);
        setUserData(snap.exists() ? snap.data() : { role: "user" });
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);

  return { user, userData, loading, signUpUser, loginUser, logOut, db };
};

export { auth, db };
export default useFirebase;

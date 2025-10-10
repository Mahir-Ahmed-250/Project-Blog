import {useState, useEffect} from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail, // ✅ Import for forgot password
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import initializeFirebase from "../Firebase/firebase.init";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

const firebaseApp = initializeFirebase();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

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
        {method: "POST", body: formData}
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

      await updateProfile(firebaseUser, {displayName: username, photoURL});

      // Save with role = "user"
      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,
        username,
        email,
        photoURL: photoURL || null,
        role: "user",
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

      setUser(res.user);

      const docRef = doc(db, "users", res.user.uid);
      const snap = await getDoc(docRef);
      const data = snap.exists() ? snap.data() : {role: "user"};
      setUserData(data);

      if (data.role) {
        navigate("/dashboard", {replace: true});
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

  // 🔹 Forgot Password
  const resetPassword = async (email) => {
    if (!email) return toast.error("Please enter your email!");
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent",
        text: `Check your inbox at ${email}`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send password reset email: " + err.message);
    }
  };
  // 🔹 Auth observer
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.emailVerified) {
        setUser(firebaseUser);
        const docRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(docRef);
        setUserData(snap.exists() ? snap.data() : {role: "user"});
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);
  // 🔹 Update user profile (name + photo)
  const updateUserProfile = async (uid, newName, profileFileOrUrl) => {
    setLoading(true);
    try {
      let photoURL = null;

      if (profileFileOrUrl instanceof File) {
        photoURL = await uploadToImgBB(profileFileOrUrl);
      } else if (typeof profileFileOrUrl === "string") {
        photoURL = profileFileOrUrl;
      }

      // Update Firebase Auth profile
      if (auth.currentUser && auth.currentUser.uid === uid) {
        await updateProfile(auth.currentUser, {
          displayName: newName || auth.currentUser.displayName,
          photoURL: photoURL || auth.currentUser.photoURL,
        });
      }

      // Update Firestore user document
      const docRef = doc(db, "users", uid);
      await setDoc(
        docRef,
        {
          username: newName || "",
          photoURL: photoURL || null,
        },
        {merge: true}
      );

      // Refresh local userData
      setUser((prev) => ({...prev, username: newName, photoURL}));

      toast.success("Profile updated successfully!");
      navigate("/dashboard", {replace: true});
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile: " + err.message);
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
      navigate("/login", {replace: true});
    } catch (err) {
      toast.error(err.message);
    }
  };

  return {
    user,
    userData,
    loading,
    signUpUser,
    loginUser,
    logOut,
    db,
    resetPassword,
    updateUserProfile,
  };
};

export {auth, db};
export default useFirebase;

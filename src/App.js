import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./UserPanel/Home/Home/Home";
import NavigationBar from "./Components/NavigationBar/NavigationBar";
import Footer from "./Components/Footer/Footer";
import EverydayLifestyles from "./UserPanel/Blog/EverydayLifestyle/EverydayLifestyles/EverydayLifestyles";
import HealthAndWellnessS from "./UserPanel/Blog/HealthAndWellness/HealthAndWellnessS/HealthAndWellnessS";
import EventAndSuccessfulPeoples from "./UserPanel/Blog/EventAndSuccessfulPeople/EventAndSuccessfulPeoples/EventAndSuccessfulPeoples";
import EventAndSuccessfulPeople from "./UserPanel/Blog/EventAndSuccessfulPeople/EventAndSuccessfulPeople/EventAndSuccessfulPeople";
import ContactMe from "./UserPanel/ContactMe/ContactMe";
import AboutMe from "./UserPanel/AboutMe/AboutMe";
import Shops from "./UserPanel/Shop/Shops/Shops";
import Login from "./AdminPanel/Login/Login";
import Wrapper from "./Components/Wrapper/Wrapper";
import SignUp from "./AdminPanel/SignUp/SignUp";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import useFirebase from "./Hooks/useFirebase";
import NotFound from "./UserPanel/NotFound/NotFound";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from './Assets/Loading.json';
import UserDashboard from "./AdminPanel/UserDashboard/UserDashboard";
import AdminDashboard from "./AdminPanel/AdminDashboard/AdminDashboard";

function App() {
  const { user, loading } = useFirebase(); // ✅ make sure useFirebase returns loading

  if (loading) {
    // ✅ While Firebase checks if user is logged in, show loader instead of login
    return <div className="container">
      <div>
        <br />
        <Player
          autoplay
          loop
          src={animationData}
          style={{ width: "100%", height: "100vh" }}
        />
      </div>
    </div>;
  }

  return (
    <>
      <Wrapper>
        <NavigationBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/blog/everydayLifestyle" element={<EverydayLifestyles />} />
          <Route path="/blog/healthAndWellness" element={<HealthAndWellnessS />} />
          <Route path="/blog/eventAndSuccessfulPeople" element={<EventAndSuccessfulPeoples />} />
          <Route path="/blog/everyday-lifestyle/:slug" element={<EventAndSuccessfulPeople />} />
          <Route path="/contact" element={<ContactMe />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/shops" element={<Shops />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/signUp"
            element={user ? <Navigate to="/dashboard" replace /> : <SignUp />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />


          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />

        {/* Toast container */}
        <ToastContainer
          position="bottom-right"
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />
      </Wrapper>
    </>
  );
}

export default App;

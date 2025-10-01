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
import SignUp from "./AdminPanel/SignUp/SignUp";
import ForgotPassword from "./AdminPanel/ForgetPassword/ForgetPassword";
import UpdateProfile from "./AdminPanel/UpdateProfile/UpdateProfile";
import UserDashboard from "./AdminPanel/UserDashboard/UserDashboard";
import AdminDashboard from "./AdminPanel/AdminDashboard/AdminDashboard";
import CreateAnAdmin from "./AdminPanel/CreateAnAdmin/CreateAnAdmin";
import Wrapper from "./Components/Wrapper/Wrapper";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import useFirebase from "./Hooks/useFirebase";
import NotFound from "./UserPanel/NotFound/NotFound";
import { ToastContainer } from "react-toastify";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "./Assets/Loading2.json";
import EverydayLifestyle from "./UserPanel/Blog/EverydayLifestyle/EverydayLifestyle/EverydayLifestyle";
import AdminEverydayLifeStyle from "./AdminPanel/AdminBlogs/AdminEverydayLifeStyle/AdminEverydayLifeStyle";
import AdminHealthAndWellness from "./AdminPanel/AdminBlogs/AdminHealthAndWellness/AdminHealthAndWellness";
import AdminEventAndSuccessfulPeople from "./AdminPanel/AdminBlogs/AdminEventAndSuccessfulPeople/AdminEventAndSuccessfulPeople";
import HealthAndWellness from "./UserPanel/Blog/HealthAndWellness/HealthAndWellness/HealthAndWellness";
import AdminShop from "./AdminPanel/AdminShop/AdminShop";



function App() {
  const { user, loading, userData } = useFirebase();

  // ✅ Show loader while checking Firebase auth
  if (loading) {
    return (
      <div className="container">
        <div>
          <br />
          <Player
            autoplay
            loop
            src={animationData}
            style={{ width: "100%", height: "100vh" }}
          />
        </div>
      </div>
    );
  }

  return (
    <Wrapper>
      <NavigationBar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog/everydayLifestyle" element={<EverydayLifestyles />} />
        <Route path="/blog/healthAndWellness" element={<HealthAndWellnessS />} />
        <Route path="/blog/eventAndSuccessfulPeople" element={<EventAndSuccessfulPeoples />} />
        <Route path="/blog/everyday-lifestyle/:id" element={<EverydayLifestyle />} />
        <Route path="/blog/health-and-wellness/:id" element={<HealthAndWellness />} />
        <Route path="/blog/event-and-successful-people/:id" element={<EventAndSuccessfulPeople />} />

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/updateProfile"
          element={
            <PrivateRoute allowedRoles={["super-admin", "admin", "user"]}>
              <UpdateProfile />
            </PrivateRoute>
          }
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["user", "admin", "super-admin"]}>
              {userData?.role === "user" ? <UserDashboard /> : <AdminDashboard />}
            </PrivateRoute>
          }
        />
        <Route
          path="/createAnAdmin"
          element={
            <PrivateRoute allowedRoles={["super-admin"]}>
              <CreateAnAdmin />
            </PrivateRoute>
          }
        />

        {/* Admin Everyday Lifestyle Editor */}
        <Route
          path="/adminEverydayLifeStyle"
          element={
            <PrivateRoute allowedRoles={["super-admin", "admin"]}>
              <AdminEverydayLifeStyle />
            </PrivateRoute>
          }
        />
        {/* Admin Health And Wellness Editor */}
        <Route
          path="/adminHealthAndWellness"
          element={
            <PrivateRoute allowedRoles={["super-admin", "admin"]}>
              <AdminHealthAndWellness />
            </PrivateRoute>
          }
        />
        {/* Admin Event And Successful People Editor */}
        <Route
          path="/adminEventAndSuccessfulPeople"
          element={
            <PrivateRoute allowedRoles={["super-admin", "admin"]}>
              <AdminEventAndSuccessfulPeople />
            </PrivateRoute>
          }
        />
        {/* Admin Shop Editor */}
        <Route
          path="/adminShop"
          element={
            <PrivateRoute allowedRoles={["super-admin", "admin"]}>
              <AdminShop />
            </PrivateRoute>
          }
        />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </Wrapper>
  );
}

export default App;

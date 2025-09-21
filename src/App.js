import { Route, Routes } from "react-router-dom";
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
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import Login from "./AdminPanel/Login/Login";


function App() {
  return (
    <>
      <NavigationBar />
      <ScrollToTop />  {/* ✅ auto scroll on route change */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog/everydayLifestyle" element={<EverydayLifestyles />} />
        <Route path="/blog/healthAndWellness" element={<HealthAndWellnessS />} />
        <Route path="/blog/eventAndSuccessfulPeople" element={<EventAndSuccessfulPeoples />} />
        <Route path="/blog/everyday-lifestyle/:slug" element={<EventAndSuccessfulPeople />} />
        <Route path="/contact" element={<ContactMe />} />
        <Route path="/about" element={<AboutMe />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import Home from "./UserPanel/Home/Home/Home";
import NavigationBar from "./Components/NavigationBar/NavigationBar";
import Footer from "./Components/Footer/Footer";
import EverydayLifestyles from "./UserPanel/Blog/EverydayLifestyle/EverydayLifestyles/EverydayLifestyles";
import HealthAndWellnessS from "./UserPanel/Blog/HealthAndWellness/HealthAndWellnessS/HealthAndWellnessS";
import EventAndSuccessfulPeoples from "./UserPanel/Blog/EventAndSuccessfulPeople/EventAndSuccessfulPeoples/EventAndSuccessfulPeoples";
import EventAndSuccessfulPeople from "./UserPanel/Blog/EventAndSuccessfulPeople/EventAndSuccessfulPeople/EventAndSuccessfulPeople";

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog/everydayLifestyle" element={<EverydayLifestyles />} />
        <Route path="/blog/healthAndWellness" element={<HealthAndWellnessS />} />
        <Route path="/blog/eventAndSuccessfulPeople" element={<EventAndSuccessfulPeoples />} />
        <Route path="/blog/everyday-lifestyle/:slug" element={<EventAndSuccessfulPeople />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

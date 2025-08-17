import { Route, Routes } from "react-router-dom";
import Home from "./UserPanel/Home/Home/Home";
import NavigationBar from "./Components/NavigationBar/NavigationBar";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

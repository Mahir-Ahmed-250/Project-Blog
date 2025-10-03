import {useLayoutEffect} from "react";
import {useLocation} from "react-router-dom";

const Wrapper = ({children}) => {
  const location = useLocation();

  useLayoutEffect(() => {
    // Scroll after a tiny delay to let /shops render images
    setTimeout(() => {
      window.scrollTo({top: 0, behavior: "smooth"});
    }, 50); // 50ms is enough
  }, [location.pathname]);

  return children;
};

export default Wrapper;

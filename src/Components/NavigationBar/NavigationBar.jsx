import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import homeIcon from "../../Assets/Home.gif";
import {Link} from "react-router-dom";
import {NavDropdown} from "react-bootstrap";
import "./NavigationBar.css";
const NavigationBar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  return (
    <>
      {["xxl"].map((expand) => (
        <Navbar
          sticky="top"
          key={expand}
          expand={expand}
          className={`mb-3 bg-light`}>
          <Container>
            <Link to="/" style={{textDecoration: "none"}}>
              <Navbar.Brand className="homeName">
                A Lifestyle Blog By Ariful
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand-${expand}`}
              onClick={handleShow}
            />
            <Navbar.Offcanvas
              show={showOffcanvas}
              onHide={handleClose}
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  <h1 className="homeName">A Lifestyle Blog By Ariful</h1>
                </Offcanvas.Title>
              </Offcanvas.Header>

              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Link
                    to="/"
                    style={{textDecoration: "none", color: "black"}}
                    className="mx-auto">
                    <img src={homeIcon} alt="" className="homeIcon" />
                  </Link>

                  <NavDropdown
                    title="Blog"
                    id="blog-dropdown"
                    className="homeLink my-auto"
                    onClick={(e) => e.stopPropagation()} // Prevents dropdown from closing Offcanvas immediately
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/blog/everydayLifestyle"
                      onClick={handleClose}>
                      Everyday Lifestyle
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/blog/healthAndWellness"
                      onClick={handleClose}>
                      Health and Wellness
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/blog/eventAndSuccessfulPeople"
                      onClick={handleClose}>
                      Event and Successful People
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Other Links */}
                  <Nav.Link
                    as={Link}
                    to="/about"
                    className="homeLink my-auto"
                    onClick={handleClose}>
                    About Me
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/contact"
                    className="homeLink my-auto"
                    onClick={handleClose}>
                    Contact Me
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/shops"
                    className="homeLink my-auto"
                    onClick={handleClose}>
                    Shop
                  </Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
};

export default NavigationBar;

import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import homeIcon from "../../Assets/Home.gif";
import { Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import "./NavigationBar.css";
import useFirebase from "../../Hooks/useFirebase.jsx";
import profileBlankImg from "../../Assets/ProfileImg.png";
import { FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
const NavigationBar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);
  const { user, logOut } = useFirebase();
  console.log(user);

  return (
    <>
      {["xxl"].map((expand) => (
        <Navbar
          sticky="top"
          key={expand}
          expand={expand}
          className={`mb-3 bg-light`}
        >
          <Container>
            <Link to="/" style={{ textDecoration: "none" }}>
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
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  <h1 className="homeName">A Lifestyle Blog By Ariful</h1>
                </Offcanvas.Title>
              </Offcanvas.Header>

              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Link
                    to="/"
                    style={{ textDecoration: "none", color: "black" }}
                    className="mx-auto"
                  >
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
                      onClick={handleClose}
                    >
                      Everyday Lifestyle
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/blog/healthAndWellness"
                      onClick={handleClose}
                    >
                      Health and Wellness
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/blog/eventAndSuccessfulPeople"
                      onClick={handleClose}
                    >
                      Event and Successful People
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Other Links */}
                  <Nav.Link
                    as={Link}
                    to="/about"
                    className="homeLink my-auto"
                    onClick={handleClose}
                  >
                    About Me
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/contact"
                    className="homeLink my-auto"
                    onClick={handleClose}
                  >
                    Contact Me
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/shops"
                    className="homeLink my-auto"
                    onClick={handleClose}
                  >
                    Shop
                  </Nav.Link>
                  <span className="homeLink my-auto">
                    {user && user.emailVerified ? (
                      <>
                        <div className="nav-item dropdown profileIcon">
                          {/* Dropdown Toggle */}
                          <a
                            className="nav-link dropdown-toggle d-flex align-items-center"
                            href="#"
                            id="navbarDropdownMenuLink"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ color: "black" }}
                          >
                            {/* Profile Image */}
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                width="55"
                                height="55"
                                style={{ background: "#fff" }}
                                className="rounded-circle border me-2"
                                alt="Profile"
                              />
                            ) : (
                              <img
                                src={profileBlankImg}
                                width="55"
                                height="55"
                                className="rounded-circle border me-2"
                                alt="Default Profile"
                              />
                            )}

                            {/* Username */}
                            <span>{user.displayName}</span>
                          </a>

                          {/* Dropdown Menu */}
                          <ul
                            className="dropdown-menu dropdown-menu-end profileDropdown"
                            aria-labelledby="navbarDropdownMenuLink"
                          >
                            <li>
                              <Link to="/dashboard">
                                <p className="dropdown-item">
                                  <CgProfile className="me-2" /> Profile
                                </p>
                              </Link>
                            </li>
                            <li>
                              <p className="dropdown-item">
                                <MdDashboard className="me-2" /> My Orders
                              </p>
                            </li>
                            <li>
                              <p className="dropdown-item" onClick={logOut}>
                                <FiLogOut className="me-2" /> Log Out
                              </p>
                            </li>
                          </ul>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </span>
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

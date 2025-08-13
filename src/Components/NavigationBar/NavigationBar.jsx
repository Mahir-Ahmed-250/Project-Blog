import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import HomeIcon from "../../Assets/NavigationHome.png";

const NavigationBar = () => {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary ">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <NavDropdown
                title="Blog"
                id="basic-nav-dropdown"
                className="my-auto">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
              <img src={HomeIcon} alt="" height="100px" />
              <Nav.Link href="#home" className="my-auto">
                About Me
              </Nav.Link>
              <Nav.Link href="#link" className="my-auto">
                Contact Me
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavigationBar;

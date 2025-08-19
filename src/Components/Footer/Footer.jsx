import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {FaFacebook, FaTwitter, FaInstagram, FaGithub} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer style={{backgroundColor: "#f8f5f0", marginTop: "50px"}}>
      {/* Decorative SVG Wave */}
      <div style={{overflow: "hidden", lineHeight: 0}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{width: "100%", height: "80px"}}>
          <path
            fill="#bdbdbdff"
            fillOpacity="1"
            d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,234.7C672,267,768,277,864,256C960,235,1056,181,1152,176C1248,171,1344,213,1392,234.7L1440,256V320H0Z"></path>
        </svg>
      </div>

      <Container className="text-center text-md-start py-5">
        <Row>
          {/* Logo / Description */}
          <Col md={4} className="mb-4">
            <h4
              style={{fontWeight: "700", color: "#000"}}
              className="footerName">
              A Lifestyle Blog By Ariful
            </h4>
            <p style={{color: "#444"}}>
              A place to share thoughts, creativity, and knowledge. Crafted with
              ❤️
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4">
            <h5 style={{fontWeight: "600", color: "#000"}}>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" style={{color: "#444", textDecoration: "none"}}>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/blogs"
                  style={{color: "#444", textDecoration: "none"}}>
                  Blogs
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  style={{color: "#444", textDecoration: "none"}}>
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  style={{color: "#444", textDecoration: "none"}}>
                  Contact
                </a>
              </li>
            </ul>
          </Col>

          {/* Social Icons */}
          <Col md={4} className="mb-4">
            <h5 style={{fontWeight: "600", color: "#000"}}>Follow Us</h5>
            <div>
              <a
                href="#"
                style={{
                  fontSize: "1.8rem",
                  marginRight: "15px",
                  color: "#000",
                }}>
                <FaFacebook />
              </a>
              <a
                href="#"
                style={{
                  fontSize: "1.8rem",
                  marginRight: "15px",
                  color: "#000",
                }}>
                <FaTwitter />
              </a>
              <a
                href="#"
                style={{
                  fontSize: "1.8rem",
                  marginRight: "15px",
                  color: "#000",
                }}>
                <FaInstagram />
              </a>
              <a
                href="#"
                style={{
                  fontSize: "1.8rem",
                  marginRight: "15px",
                  color: "#000",
                }}>
                <FaGithub />
              </a>
            </div>
          </Col>
        </Row>

        {/* Bottom copyright */}
        <Row>
          <Col className="text-center mt-3">
            <small style={{color: "#444"}}>
              © {new Date().getFullYear()} Project Blog. All Rights Reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

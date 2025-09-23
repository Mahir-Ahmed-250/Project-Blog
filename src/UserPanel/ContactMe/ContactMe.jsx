import React, { useState } from "react";
import "./ContactMe.css";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../../Assets/Contact.json";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";

const ContactMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Field-level validation
  const validateField = (name, value) => {
    if (!value) return false;
    if (name === "phone") {
      const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10,15}$/;
      return phoneRegex.test(value);
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }
    return true; // name & message just need non-empty
  };

  const validateForm = () => {
    const { name, phone, email, message } = formData;
    if (!name || !phone || !email || !message) {
      return "⚠️ Please fill out all fields.";
    }
    if (!validateField("phone", phone)) {
      return "📞 Please enter a valid phone number.";
    }
    if (!validateField("email", email)) {
      return "📧 Please enter a valid email address.";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: validationError,
        confirmButtonColor: "#d33",
        background: "#1e1e2f",
        color: "#fff",
      });
      return;
    }

    emailjs
      .send(
        "service_4ddu4bf",
        "template_4cygi9n",
        {
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          message: formData.message,
        },
        "AcR0s8wjTA5hNRWlG"
      )
      .then(
        () => {
          Swal.fire({
            icon: "success",
            title: "✅ Message Sent!",
            text: "Your message has been delivered successfully.",
            confirmButtonColor: "#3085d6",
            background: "#f0fff4",
            color: "#1a202c",
          });
          setFormData({ name: "", phone: "", email: "", message: "" });
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "❌ Failed to Send",
            text: "Something went wrong. Please try again later.",
            confirmButtonColor: "#d33",
            background: "#fff5f5",
            color: "#742a2a",
          });
          console.error("EmailJS Error:", error);
        }
      );
  };

  return (
    <>
      <div className="contactMeBannerContainer">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1 className="homeBannerTitle">Contact Me</h1>
      </div>
      <div className="d-flex justify-content-evenly">
        <div>
          <Player
            autoplay
            loop
            src={animationData}
            style={{ width: "100%", height: "70vh" }}
          />
        </div>

        <div
          className="contact-form p-4 rounded-4 shadow-lg w-100"
          style={{ maxWidth: "500px" }}
        >
          <form onSubmit={handleSubmit} noValidate className="mt-5">
            {/* Full Name */}
            <div className="mb-3 position-relative">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${
                  formData.name
                    ? validateField("name", formData.name)
                      ? "is-valid"
                      : "is-invalid"
                    : ""
                }`}
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {formData.name && (
                <span
                  className={`validation-icon ${
                    validateField("name", formData.name) ? "valid" : "invalid"
                  }`}
                ></span>
              )}
            </div>

            {/* Phone */}
            <div className="mb-3 position-relative">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className={`form-control ${
                  formData.phone
                    ? validateField("phone", formData.phone)
                      ? "is-valid"
                      : "is-invalid"
                    : ""
                }`}
                placeholder="+880 123 456 7890"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {formData.phone && (
                <span
                  className={`validation-icon ${
                    validateField("phone", formData.phone) ? "valid" : "invalid"
                  }`}
                ></span>
              )}
            </div>

            {/* Email */}
            <div className="mb-3 position-relative">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className={`form-control ${
                  formData.email
                    ? validateField("email", formData.email)
                      ? "is-valid"
                      : "is-invalid"
                    : ""
                }`}
                placeholder="example@email.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {formData.email && (
                <span
                  className={`validation-icon ${
                    validateField("email", formData.email) ? "valid" : "invalid"
                  }`}
                ></span>
              )}
            </div>

            {/* Message */}
            <div className="mb-3 position-relative">
              <label className="form-label">Message</label>
              <textarea
                className={`form-control ${
                  formData.message
                    ? validateField("message", formData.message)
                      ? "is-valid"
                      : "is-invalid"
                    : ""
                }`}
                rows="4"
                placeholder="Type your message..."
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              {formData.message && (
                <span
                  className={`validation-icon ${
                    validateField("message", formData.message)
                      ? "valid"
                      : "invalid"
                  }`}
                ></span>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn fw-semibold"
                style={{
                  backgroundColor: "#fcb02cff",
                  color: "#020202d3",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactMe;

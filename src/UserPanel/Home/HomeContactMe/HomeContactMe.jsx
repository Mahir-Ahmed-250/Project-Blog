import React, { useState } from "react";
import "./HomeContactMe.css";
import Title from "../../../Components/Title/Title";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";

const HomeContactMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // clear error while typing
    console.log(error);
  };

  const validateForm = () => {
    const { name, phone, email, message } = formData;

    if (!name || !phone || !email || !message) {
      return "⚠️ Please fill out all fields.";
    }

    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return "📞 Please enter a valid phone number.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "📧 Please enter a valid email address.";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      Swal.fire({
        icon: "error",
        title: validationError,
        confirmButtonColor: "#d33",
        showClass: { popup: "" }, // disable animation
        hideClass: { popup: "" },
        scrollbarPadding: false, // stop layout shift
        allowOutsideClick: false, // prevent background clicks
        allowEscapeKey: false, // prevent closing with Esc
      });
      return;
    }

    // EmailJS integration
    emailjs
      .send(
        "service_4ddu4bf", // replace with your EmailJS service ID
        "template_4cygi9n", // replace with your EmailJS template ID
        {
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone,
          message: formData.message,
        },
        "AcR0s8wjTA5hNRWlG" // replace with your EmailJS public key
      )
      .then(
        () => {
          Swal.fire({
            icon: "success",
            title: "✅ Message Sent!",
            text: "Your message has been delivered successfully.",
            confirmButtonColor: "#3085d6",
            showClass: { popup: "" },
            hideClass: { popup: "" },
            scrollbarPadding: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          setFormData({ name: "", phone: "", email: "", message: "" });
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "❌ Failed to Send",
            text: "Something went wrong. Please try again later.",
            confirmButtonColor: "#d33",
            showClass: { popup: "" },
            hideClass: { popup: "" },
            scrollbarPadding: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
          console.error("EmailJS Error:", error);
        }
      );
  };

  return (
    <div className="homeContactMeContainer">
      <Title title="Let's Contact With" title2="Me" />
      <div className="d-flex justify-content-center">
        <div
          className="contact-form p-4 rounded-4 shadow-lg w-100"
          style={{ maxWidth: "500px" }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+880 123 456 7890"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="example@email.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Type your message..."
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
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
    </div>
  );
};

export default HomeContactMe;

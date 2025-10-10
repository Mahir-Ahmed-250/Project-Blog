import React, {useState} from "react";
import "./HomeContactMe.css";
import Title from "../../../Components/Title/Title";
import emailjs from "emailjs-com";
import {toast} from "react-toastify";

const HomeContactMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [setError] = useState("");

  // Single toast slot ID
  const toastId = "contact-toast";

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
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    const {name, phone, email, message} = formData;
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

  // Function that shows OR updates existing toast (resets progress bar)
  const showToast = (type, message) => {
    if (toast.isActive(toastId)) {
      toast.update(toastId, {
        render: message,
        type: type === "error" ? "error" : "success", // ✅ fixed
        autoClose: 4000, // resets the timer
      });
    } else {
      if (type === "error") {
        toast.error(message, {autoClose: 4000, toastId});
      } else {
        toast.success(message, {autoClose: 4000, toastId});
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      showToast("error", validationError);
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
          showToast(
            "success",
            "✅ Message Sent! Your message has been delivered."
          );
          setFormData({name: "", phone: "", email: "", message: ""});
        },
        (error) => {
          showToast("error", "❌ Failed to send. Please try again later.");
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
          style={{maxWidth: "500px"}}>
          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="mb-3 position-relative">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {formData.name && (
                <span
                  className={`validation-icon ${
                    validateField("name", formData.name) ? "valid" : "invalid"
                  }`}>
                  {validateField("name", formData.name) ? "✔" : "✖"}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="mb-3 position-relative">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+880 123 456 7890"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {formData.phone && (
                <span
                  className={`validation-icon ${
                    validateField("phone", formData.phone) ? "valid" : "invalid"
                  }`}>
                  {validateField("phone", formData.phone) ? "✔" : "✖"}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="mb-3 position-relative">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="example@email.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {formData.email && (
                <span
                  className={`validation-icon ${
                    validateField("email", formData.email) ? "valid" : "invalid"
                  }`}>
                  {validateField("email", formData.email) ? "✔" : "✖"}
                </span>
              )}
            </div>

            {/* Message */}
            <div className="mb-3 position-relative">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Type your message..."
                name="message"
                value={formData.message}
                onChange={handleChange}></textarea>
              {formData.message && (
                <span
                  className={`validation-icon ${
                    validateField("message", formData.message)
                      ? "valid"
                      : "invalid"
                  }`}>
                  {validateField("message", formData.message) ? "✔" : "✖"}
                </span>
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
                }}>
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

import React, {useState} from "react";
import "./HomeContactMe.css";
import Title from "../../../Components/Title/Title";

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
  };

  const validateForm = () => {
    const {name, phone, email, message} = formData;

    if (!name || !phone || !email || !message) {
      return "⚠️ Please fill out all fields.";
    }

    // Phone number validation (Bangladesh format or generic international)
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return "📞 Please enter a valid phone number.";
    }

    // Email validation
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
      return;
    }

    console.log("Form Submitted:", formData);
    alert("✅ Message sent successfully!");
    setFormData({name: "", phone: "", email: "", message: ""});
  };

  return (
    <div className="homeContactMeContainer">
      <Title title="Let's Contact With" title2="Me" />
      <div className="d-flex justify-content-center">
        <div
          className="contact-form p-4 rounded-4 shadow-lg w-100"
          style={{maxWidth: "500px"}}>
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
                onChange={handleChange}></textarea>
            </div>

            {error && <p className="text-danger fw-semibold">{error}</p>}

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

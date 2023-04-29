import { useState } from "react";
import Link from "next/link";
import { emailContactForm } from "../../actions/form";

const ContactForm = ({ authorEmail }) => {
  const [values, setValues] = useState({
    message: "",
    name: "",
    email: "",
    sent: false,
    buttonText: "Send Message",
    success: false,
    error: false,
    authorEmail: "",
  });
  const { message, name, email, sent, buttonText, success, error } = values;

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "Sending..." });
    emailContactForm({ authorEmail, name, email, message }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          sent: true,
          name: "",
          email: "",
          message: "",
          buttonText: "Sent",
          success: data.success,
        });
      }
    });
  };

  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: false,
      success: false,
      buttonText: "Send Message",
    });
  };

  const showSuccessMessage = () =>
    success && (
      <div className="alert alert-info">Thank you for contacting us.</div>
    );

  const showErrorMessage = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const contactForm = () => {
    return (
      <form onSubmit={clickSubmit} className="pt-3 pb-3">
        <div className="form-group">
          <label for="messageArea" className="lead">
            Message
          </label>
          <textarea
            onChange={handleChange("message")}
            type="text"
            rows="10"
            className="form-control"
            value={message}
            id="messageArea"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label for="name" className="lead">
            Name
          </label>
          <input
            type="text"
            onChange={handleChange("name")}
            className="form-control"
            value={name}
            id="name"
          ></input>
        </div>
        <div className="form-group">
          <label for="email" className="lead">
            Email
          </label>
          <input
            type="email"
            onChange={handleChange("email")}
            className="form-control"
            value={email}
            id="email"
          ></input>
        </div>
        <div>
          <button className="btn btn-primary mt-3">{buttonText}</button>
        </div>
      </form>
    );
  };

  return (
    <>
      {showSuccessMessage()}
      {showErrorMessage()}
      {contactForm()}
    </>
  );
};

export default ContactForm;

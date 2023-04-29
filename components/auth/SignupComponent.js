import { useState, useEffect } from "react";
import { signup, isAuth, preSignup } from "../../actions/auth";
import Router from "next/router";
import Link from "next/link";

const SignupComponent = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { name, email, password, error, loading, message, showForm } = values;

  useEffect(() => {
    isAuth() && Router.push(`/`);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.table({ name, email, password, error, loading, message, showForm });
    setValues({ ...values, loading: true, error: false });
    const user = { name, email, password };
    preSignup(user).then((data) => {
      // error: string as an error
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          loading: false,
          message: data.message,
          showForm: false,
        });
      }
    });
  };

  const handleChange = (inputName) => (e) => {
    setValues({ ...values, error: false, [inputName]: e.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">loading...</div> : "";
  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : "";

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-2">
          <input
            value={name}
            onChange={handleChange("name")}
            type="text"
            className="form-control"
            placeholder="Enter your pen name"
          />
        </div>
        <div className="form-group mt-2">
          <input
            value={email}
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group mt-2">
          <input
            value={password}
            onChange={handleChange("password")}
            type="password"
            className="form-control"
            placeholder="Enter your password"
          />
        </div>
        <button className="btn btn-primary mt-2">Signup</button>
      </form>
    );
  };

  return (
    <>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signupForm()}
      <br />
      <Link href="/auth/password/forgot" legacyBehavior>
        <a className="btn btn-outline-danger btn-sm">Forgot Password</a>
      </Link>
    </>
  );
};

export default SignupComponent;

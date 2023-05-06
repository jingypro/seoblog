import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { getCookie, isAuth, updateUser } from "../../actions/auth";
import { getProfile, update } from "../../actions/user";
import { API } from "../../config";

const ProfileUpdate = () => {
  const [values, setValues] = useState({
    username: "",
    username_for_photo: "",
    name: "",
    email: "",
    about: "",
    password: "",
    error: false,
    success: false,
    loading: false,
    photo: "",
    userData: process.browser && new FormData(),
  });

  const token = getCookie("token");
  const {
    username,
    username_for_photo,
    name,
    email,
    about,
    password,
    error,
    success,
    loading,
    photo,
    userData,
  } = values;

  const init = () => {
    getProfile(token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          username: data.username,
          username_for_photo: data.username,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };

  useEffect(() => {
    init();
    setValues({ ...values, userData: new FormData() });
  }, []);

  //   const handleChange = (name) => (e) => {
  //     const value = name === "photo" ? e.target.files[0] : e.target.value;
  //     let userFormData = new FormData();
  //     userFormData.set(name, value);
  //     // console.log("userFormData:", userFormData);
  //     setValues({
  //       ...values,
  //       [name]: value,
  //       userData: userFormData,
  //       error: false,
  //       success: false,
  //     });
  //   };

  const handleChange = (name) => (e) => {
    if (name === "photo") {
      const file = e.target.files[0];
      setValues((prevValues) => ({
        ...prevValues,
        [name]: file,
        error: false,
        success: false,
      }));

      setValues((prevValues) => {
        const updatedUserData = prevValues.userData;
        updatedUserData.set(name, file);

        return {
          ...prevValues,
          userData: updatedUserData,
        };
      });
    } else {
      const value = e.target.value;
      setValues((prevValues) => {
        const updatedValues = {
          ...prevValues,
          [name]: value,
          error: false,
          success: false,
        };

        // Update userFormData here
        const updatedUserData = prevValues.userData;
        updatedUserData.set(name, value);

        return {
          ...updatedValues,
          userData: updatedUserData,
        };
      });
    }
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // console.log("userData:", userData);
  //     setValues({ ...values, loading: true });
  //     update(token, userData).then((data) => {
  //       if (data.error) {
  //         setValues({
  //           ...values,
  //           error: data.error,
  //           success: false,
  //           loading: false,
  //         });
  //       } else {
  //         setValues({
  //           ...values,
  //           username: data.username,
  //           name: data.name,
  //           email: data.email,
  //           about: data.about,
  //           success: true,
  //           loading: false,
  //         });
  //       }
  //     });
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUserData = values.userData; // Get userData from the state
    setValues({ ...values, loading: true });
    update(token, updatedUserData).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          loading: false,
        });
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            username: data.username,
            name: data.name,
            email: data.email,
            about: data.about,
            success: true,
            loading: false,
          });
        });
      }
    });
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-2">
        <label htmlFor="" className="text-muted d-block">
          Profile Photo
        </label>
        <input onChange={handleChange("photo")} type="file" accept="image/*" />
      </div>
      <div className="form-group mb-2">
        <label htmlFor="" className="text-muted">
          Username
        </label>
        <input
          onChange={handleChange("username")}
          type="text"
          value={username}
          className="form-control"
        />
      </div>
      <div className="form-group mb-2">
        <label htmlFor="" className="text-muted">
          Name
        </label>
        <input
          onChange={handleChange("name")}
          type="text"
          value={name}
          className="form-control"
        />
      </div>
      <div className="form-group mb-2">
        <label htmlFor="" className="text-muted">
          Email
        </label>
        <input
          onChange={handleChange("email")}
          type="email"
          value={email}
          className="form-control"
        />
      </div>
      <div className="form-group mb-2">
        <label htmlFor="" className="text-muted">
          About
        </label>
        <textarea
          onChange={handleChange("about")}
          type="text"
          value={about}
          className="form-control"
        />
      </div>
      <div className="form-group mb-2">
        <label htmlFor="" className="text-muted">
          Password
        </label>
        <input
          onChange={handleChange("password")}
          type="password"
          value={password}
          className="form-control"
        />
      </div>

      <button type="submit" className="mt-2 btn btn-primary">
        Submit
      </button>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      Profile updated
    </div>
  );

  const showLoading = () => (
    <div
      className="alert alert-info"
      style={{ display: loading ? "" : "none" }}
    >
      Loading...
    </div>
  );

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img
              src={`${API}/user/photo/${username_for_photo}`}
              className="img img-fluid img-thumbnail mb-3"
              style={{ maxHeight: "auto", maxWidth: "100%" }}
              alt="user profile"
            />
          </div>
          <div className="col-md-8 mb-5">
            {showSuccess()}
            {showError()}
            {showLoading()}
            {profileUpdateForm()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;

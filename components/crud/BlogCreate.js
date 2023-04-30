import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillModules, QuillFormats } from "../../helpers/quill";

////////////////
const CreateBlog = ({ router }) => {
  //The following code causes server-client mismatch
  ///////////////////////////////////////////////////
  // const blogFromLS = () => {
  //   if (typeof window === "undefined") {
  //     return "";
  //   }
  //   if (localStorage.getItem("blog")) {
  //     return JSON.parse(localStorage.getItem("blog"));
  //   }
  //   return "";
  // };
  // const [body, setBody] = useState(blogFromLS());

  // Fix. Set the initial state to ""
  // And update it under useEffect()
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checkedCat, setCheckedCat] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false,
    loading: false,
  });

  const {
    error,
    sizeError,
    success,
    formData,
    title,
    hidePublishButton,
    loading,
  } = values;

  const token = getCookie("token");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const blogData = localStorage.getItem("blog");
      if (blogData) {
        setBody(JSON.parse(blogData));
      }
    }
  }, []);

  useEffect(() => {
    initCategories();
    initTags();
    setValues({ ...values, formData: new FormData() });
  }, [router]);

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };
  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const publishBlog = (e) => {
    setValues({ ...values, loading: true });
    e.preventDefault();
    // console.log('ready to publishBlog');
    createBlog(formData, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          loading: false,
          title: "",
          error: "",
          success: `A new blog titled "${data.title}" is created`,
        });
        setBody("");
        setCategories([]);
        setTags([]);
      }
      Router.push(`/admin/crud/blog`);
    });
  };

  // The reason why we need to check against name === 'title' and name === 'photo' is that these two fields require special handling.
  // For the title field, we want to set its value directly on the formData object because it is a regular field. This is done using the formData.set method.
  // For the photo field, we want to append the file to the formData object instead of setting its value directly. This is because files are treated differently than regular fields. This is done using the formData.append method.
  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;

    if (name === "title") {
      formData.set(name, value);
    } else if (name === "photo") {
      formData.append("photo", e.target.files[0]);
    } else {
      formData.set(name, value);
    }

    setValues({ ...values, [name]: value, formData: formData, error: "" });
  };

  const handleBody = (e) => {
    // console.log(e);
    setBody(e);
    formData.set("body", e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };

  const handleToogleCat = (c) => () => {
    setValues({ ...values, error: "" });

    // return the first index or -1
    const clickedCategory = checkedCat.indexOf(c);
    const all = [...checkedCat];
    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setCheckedCat(all);
    formData.set("categories", all);
  };

  const handleToogleTag = (t) => () => {
    setValues({ ...values, error: "" });

    // return the first index or -1
    const clickedTag = checkedTag.indexOf(t);
    const all = [...checkedTag];
    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);
    formData.set("tags", all);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToogleCat(c._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToogleTag(t._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };

  ///////////Show Messages/////////////
  const dismissMessage = () => {
    setValues({ ...values, error: "", success: "" });
  };

  const showError = () => (
    <div
      className={`alert alert-danger d-flex align-items-center ${
        error ? "" : "d-none"
      }`}
      role="alert"
    >
      <div>{error}</div>
      <button
        type="button"
        className="btn-close ms-auto"
        onClick={dismissMessage}
        aria-label="Close"
      ></button>
    </div>
  );

  const showSuccess = () => (
    <div
      className={`alert alert-success d-flex align-items-center ${
        success ? "" : "d-none"
      }`}
      role="alert"
    >
      <div>{success}</div>
      <button
        type="button"
        className="btn-close ms-auto"
        onClick={dismissMessage}
        aria-label="Close"
      ></button>
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
  ///////////////////////////////

  const createBlogForm = () => {
    // console.log(formData);
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group mb-2">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          ></input>
        </div>
        <div className="form-group mb-2">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
            {showLoading()}
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured Image</h5>
              <hr />
              <small className="text-muted">Max size: 1 MB</small>
              <br />
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                ></input>
              </label>
            </div>
          </div>
          <div className="mt-2">
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div className="mt-4">
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CreateBlog);

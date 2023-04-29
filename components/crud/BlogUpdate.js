import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { singleBlog, updateBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "../../node_modules/react-quill/dist/quill.snow.css";
import { QuillModules, QuillFormats } from "../../helpers/quill";
import { da } from "date-fns/locale";
import { API } from "../../config";

const BlogUpdate = ({ router }) => {
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checkedCat, setCheckedCat] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);
  const [values, setValues] = useState({
    title: "",
    error: "",
    success: "",
    formData: "",
  });

  const formDataRef = useRef(
    typeof window !== "undefined" ? new FormData() : null
  );

  const { error, success, title, formData } = values;

  const token = getCookie("token");

  useEffect(() => {
    formDataRef.current = new FormData();
    initBlog();
    initCategories();
    initTags();
  }, [router]);

  // const initBlog = () => {
  //   if (router.query.slug) {
  //     singleBlog(router.query.slug).then((data) => {
  //       if (data.error) {
  //         console.log(data.error);
  //       } else {
  //         setValues({ ...values, title: data.title });
  //         setBody(data.body);
  //         setCategoriesArray(data.categories);
  //         setTagsArray(data.tags);
  //       }
  //     });
  //   }
  // };

  const initBlog = () => {
    if (router.query.slug) {
      formDataRef.current = new FormData();
      singleBlog(router.query.slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (blogCategories) => {
    let catArray = [];
    blogCategories.map((c, i) => {
      catArray.push(c._id);
    });
    setCheckedCat(catArray);
  };
  const setTagsArray = (blogTags) => {
    let tagArray = [];
    blogTags.map((t, i) => {
      tagArray.push(t._id);
    });
    setCheckedTag(tagArray);
  };

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

  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;

    if (name === "title") {
      formDataRef.current.set(name, value);
    } else if (name === "photo") {
      formDataRef.current.append("photo", e.target.files[0]);
    } else if (name === "categories" || name === "tags") {
      const options = Array.from(e.target.options);
      const values = options.filter((o) => o.selected).map((o) => o.value);
      formDataRef.current.set(name, values);
    } else {
      formDataRef.current.set(name, value);
    }

    setValues({ ...values, [name]: value, error: "" });
  };

  const handleBody = (e) => {
    setBody(e);
    formDataRef.current.set("body", body);
    formDataRef.current.set("body", e);
    setValues({ ...values, error: "" });
  };

  const editBlog = (e) => {
    e.preventDefault();
    updateBlog(formDataRef.current, token, router.query.slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          success: `Blog title "${data.title}" is successfully updated.`,
        });
        if (isAuth() && isAuth().role === 1) {
          // Router.replace("/admin");
          Router.replace(`/admin/crud/${router.query.slug}`);
        } else if (isAuth() && isAuth().role === 0) {
          // Router.replace("/user");
          Router.replace(`/user/crud/${router.query.slug}`);
        }
      }
    });
  };

  // const handleToogleCat = (c) => () => {
  //   setValues({ ...values, error: "" });

  //   // return the first index or -1
  //   const clickedCategory = checkedCat.indexOf(c);
  //   const all = [...checkedCat];
  //   if (clickedCategory === -1) {
  //     all.push(c);
  //   } else {
  //     all.splice(clickedCategory, 1);
  //   }
  //   console.log(all);
  //   setCheckedCat(all);
  //   formData.set("categories", all);
  // };

  // const handleToogleTag = (t) => () => {
  //   setValues({ ...values, error: "" });

  //   // return the first index or -1
  //   const clickedTag = checkedTag.indexOf(t);
  //   const all = [...checkedTag];
  //   if (clickedTag === -1) {
  //     all.push(t);
  //   } else {
  //     all.splice(clickedTag, 1);
  //   }
  //   console.log(all);
  //   setCheckedTag(all);
  //   formData.set("tags", all);
  // };

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
    formDataRef.current.set("categories", all);
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
    formDataRef.current.set("tags", all);
  };

  const findOutCategory = (c) => {
    const result = checkedCat.indexOf(c);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const findOutTag = (t) => {
    const result = checkedTag.indexOf(t);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToogleCat(c._id)}
            checked={findOutCategory(c._id)}
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
            checked={findOutTag(t._id)}
            type="checkbox"
            className="mr-2"
          ></input>
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };

  const hideMessages = () => {
    setValues({ ...values, error: "", success: "" });
  };

  const showError = () => {
    if (error) {
      setTimeout(() => {
        hideMessages();
      }, 2000);
    }
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };

  const showSuccess = () => {
    if (success) {
      setTimeout(() => {
        hideMessages();
      }, 2000);
    }
    return (
      <div
        className="alert alert-success"
        style={{ display: success ? "" : "none" }}
      >
        {success}
      </div>
    );
  };

  const updateBlogForm = () => {
    // console.log(formData);
    return (
      <form onSubmit={editBlog}>
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
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}
          <div className="pt-3">
            {showSuccess()}
            {showError()}
          </div>
          {body && (
            <img
              src={`${API}/blog/photo/${router.query.slug}`}
              alt={title}
              style={{ width: "100%" }}
            />
          )}
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

export default withRouter(BlogUpdate);

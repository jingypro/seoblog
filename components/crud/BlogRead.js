import Link from "next/link";
import { useState, useEffect } from "react";
// import Router from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { list, removeBlog } from "../../actions/blog";
import { parseISO, formatRelative } from "date-fns";
// import blog from "../../../backend/models/blog";

const BlogRead = ({ username }) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    list(username).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  const deleteBlog = (slug) => {
    removeBlog(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
        setTimeout(() => {
          setMessage("");
        }, 3000); // set timer for 3 seconds
      }
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete your blog?");
    if (answer) {
      deleteBlog(slug);
    }
  };

  const showUpdateButton = (blog) => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/${blog.slug}`} legacyBehavior>
          <a className="btn btn-sm btn-warning mx-2">Update</a>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${blog.slug}`} legacyBehavior>
          <a className="btn btn-sm btn-warning mx-2">Update</a>
        </Link>
      );
    }
  };

  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <div key={i} className="pb-5">
          <h3>{blog.title}</h3>
          <p className="mark">
            Written by{" "}
            <Link href={`/profile/${blog.postedBy.username}`}>
              {blog.postedBy.username}
            </Link>{" "}
            | Last updated{" "}
            {formatRelative(parseISO(blog.updatedAt), new Date())}
          </p>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteConfirm(blog.slug)}
          >
            Delete
          </button>
          {showUpdateButton(blog)}
        </div>
      );
    });
  };

  return (
    <>
      <div className="row">
        {message && <div className="alert alert-warning">{message}</div>}
        <div className="col-md-12">{showAllBlogs()}</div>
      </div>
    </>
  );
};

export default BlogRead;

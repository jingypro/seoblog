import Head from "next/head";
import Link from "next/link";
// import { withRouter } from "next/router";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { singleBlog, listRelated } from "../../actions/blog";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import renderHTML from "html-react-parser";
import { parseISO, formatRelative } from "date-fns";
import SmallCard from "../../components/blog/SmallCard";
import DisqusThread from "../../components/DisqusThread";

// at frontend, params are accessible via router; at back, they are accessible via query.
const SingleBlog = ({ blog }) => {
  const [related, setRelated] = useState([]);
  const loadRelated = () => {
    listRelated({ blog }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };

  useEffect(() => {
    loadRelated();
  }, []);

  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta name="description" content={blog.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/blogs/${blog.slug}`} />
      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.mdesc} />
      <meta property="og:type" content={"website"} />
      <meta property="og:url" content={`${DOMAIN}/blogs/${blog.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
      <meta
        property="og:image:secure_url"
        content={`${API}/blog/photo/${blog.slug}`}
      />
      <meta property="og:image:type" content={"image/jpg"} />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta name="twitter:description" content={blog.mdesc} />
      <meta name="twitter:image" content={`${API}/blog/photo/${blog.slug}`} />
    </Head>
  );

  const showBlogCategories = (blog) =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`} legacyBehavior>
        <a className="btn btn-primary mx-1 mt-3">{c.name}</a>
      </Link>
    ));

  const showBlogTags = (blog) => {
    return blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`} legacyBehavior>
        <a className="btn btn-outline-primary mx-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  const showRelatedBlogs = () => {
    return related.map((blog, i) => (
      <div className="col-md-4" key={i}>
        <article>
          <SmallCard blog={blog} />
        </article>
      </div>
    ));
  };

  const showComments = () => {
    return (
      <div>
        <DisqusThread
          id={blog.id}
          title={blog.title}
          path={`/blog/${blog.slug}`}
        />
      </div>
    );
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: "-30px" }}>
                  <img
                    src={`${API}/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img img-fluid feature-image"
                  />
                </div>
              </section>
            </div>
            <div className="container">
              <section>
                <div className="row">
                  <h1 className="display-2 pt-3 pb-2 text-center font-weight-bold">
                    {blog.title}
                  </h1>
                  <p className="lead mt-3 mark">
                    Written by{" "}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                      {blog.postedBy.username}
                    </Link>{" "}
                    | Last updated{" "}
                    {formatRelative(parseISO(blog.updatedAt), new Date())}
                  </p>
                  <div className="pb-3">
                    {showBlogCategories(blog)}
                    {showBlogTags(blog)}
                    <br />
                  </div>
                </div>
              </section>
            </div>
            <div className="container">
              <section>
                <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
              </section>
            </div>
            <div className="container">
              <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
              <hr />
              <div className="row">{showRelatedBlogs()}</div>
            </div>
            <div className="container pt-5 pb-5">{showComments()}</div>
          </article>
        </main>
      </Layout>
    </>
  );
};

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      //   console.log("GET INITIAL PROPS IN SINGLE BLOG", data);
      return { blog: data };
    }
  });
};

export default SingleBlog;

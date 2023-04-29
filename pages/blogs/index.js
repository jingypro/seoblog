import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import Layout from "../../components/Layout";
import { useState } from "react";
import { listBlogsWithCatsAndTags } from "../../actions/blog";
// import { API } from "../../config";
// import renderHTML from "html-react-parser";
// import { parseISO, formatRelative } from "date-fns";
import Card from "../../components/blog/Card.js";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";

const Blogs = ({
  blogs,
  categories,
  tags,
  totalBlogs,
  blogsLimit,
  blogsSkip,
  router,
}) => {
  const title = `Brilliant Blogs and Tutorials | ${APP_NAME}`;
  const head = () => (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="Random blogs and tutorials on mass effect and nature"
      />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta
        property="og:title"
        content={`Latest blogs and tutorials | ${APP_NAME}`}
      />
      <meta
        property="og:description"
        content={`Latest blogs and tutorials | ${APP_NAME}`}
      />
      <meta property="og:type" content={"website"} />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      <meta
        property="og:image"
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
      <meta property="og:image:type" content={"image/jpg"} />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content={`Latest blogs and tutorials | ${APP_NAME}`}
      />
      <meta
        name="twitter:description"
        content={`Latest blogs and tutorials | ${APP_NAME}`}
      />
      <meta
        name="twitter:image"
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
    </Head>
  );

  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogsWithCatsAndTags(toSkip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
          Load more
        </button>
      )
    );
  };

  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <article key={i}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };

  const showAllCategories = () => {
    return categories.map((c, i) => (
      <Link href={`/categories/${c.slug}`} key={i} legacyBehavior>
        <a className="btn btn-primary mx-1 mt-3">{c.name}</a>
      </Link>
    ));
  };

  const showAllTags = () => {
    return tags.map((t, i) => (
      <Link href={`/tags/${t.slug}`} key={i} legacyBehavior>
        <a className="btn btn-outline-primary mx-1 mt-3">{t.name}</a>
      </Link>
    ));
  };

  const showLoadedBlogs = () => {
    return loadedBlogs.map((blog, i) => (
      <article key={i}>
        <Card blog={blog} />
        <hr />
      </article>
    ));
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  Brilliant Blogs and Tutotrials
                </h1>
                <section>
                  <div className="pb-5 text-center">
                    {showAllCategories()}
                    <br />
                    {showAllTags()}
                  </div>
                </section>
              </div>
            </header>
          </div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="container-fluid">{showLoadedBlogs()}</div>
          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
        </main>
      </Layout>
    </>
  );
};

Blogs.getInitialProps = () => {
  let skip = 0;
  let limit = 2;
  return listBlogsWithCatsAndTags(skip, limit).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        totalBlogs: data.size,
        blogsLimit: limit,
        blogsSkip: skip,
      };
    }
  });
};

export default withRouter(Blogs); //getInitialProps

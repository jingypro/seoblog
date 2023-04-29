import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { singleTag } from "../../actions/tag";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import renderHTML from "html-react-parser";
import { parseISO, formatRelative } from "date-fns";
import Card from "../../components/blog/Card";

const Tag = ({ tag, blogs }) => {
  const head = () => (
    <Head>
      <title>
        {tag.name} | {APP_NAME}
      </title>
      <meta name="description" content={`Best blogs on ${tag.name}`} />
      <link rel="canonical" href={`${DOMAIN}/tags/${tag.slug}`} />
      <meta property="og:title" content={`${tag.name} | ${APP_NAME}`} />
      <meta property="og:description" content={`Best blogs on ${tag.name}`} />
      <meta property="og:type" content={"website"} />
      <meta property="og:url" content={`${DOMAIN}/tags/${tag.slug}`} />
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
      <meta name="twitter:title" content={`${tag.name} | ${APP_NAME}`} />
      <meta name="twitter:description" content={`Best blogs on ${tag.name}`} />
      <meta
        name="twitter:image"
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
    </Head>
  );

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{tag.name}</h1>
                {blogs.map((b, i) => (
                  <div>
                    <hr />
                    <Card key={i} blog={b} />
                  </div>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </>
  );
};

Tag.getInitialProps = ({ query }) => {
  return singleTag(query.slug).then((data) => {
    // console.log("Data from API:", data);
    if (data.error) {
      console.log(data.error);
    } else {
      return { tag: data.tag, blogs: data.blogs };
    }
  });
};

export default Tag;

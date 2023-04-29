import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import { userPublicProfile } from "../../actions/user";
import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";
import { parseISO, formatRelative } from "date-fns";
import ContactForm from "../../components/form/ContactForm";

const UserProfile = ({ user, blogs }) => {
  const head = () => (
    <Head>
      <title>
        {user.username} | {APP_NAME}
      </title>
      <meta name="description" content={`Blogs by ${user.username}`} />
      <link rel="canonical" href={`${DOMAIN}/profile/${user.username}`} />
      <meta property="og:title" content={`${user.username} | ${APP_NAME}`} />
      <meta property="og:description" content={`Blogs by ${user.username}`} />
      <meta property="og:type" content={"website"} />
      <meta property="og:url" content={`${DOMAIN}/profile/${user.username}`} />
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
      <meta name="twitter:title" content={`${user.username} | ${APP_NAME}`} />
      <meta name="twitter:description" content={`Blogs by ${user.username}`} />
      <meta
        name="twitter:image"
        content={`${DOMAIN}/static/images/seoblog.jpg`}
      />
    </Head>
  );

  const showUserBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <div className="mt-4 mb-4" key={i}>
          <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
        </div>
      );
    });
  };
  return (
    <>
      {head()}
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5>{user.name}</h5>
                      <p className="text-muted">
                        Joined{" "}
                        {formatRelative(new Date(user.createdAt), new Date())}
                      </p>
                    </div>
                    <div className="col-md-4">
                      {" "}
                      <img
                        src={`${API}/user/photo/${user.username}`}
                        className="img img-fluid img-thumbnail mb-3"
                        style={{ maxHeight: "100px", maxWidth: "auto" }}
                        alt="user profile"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />

        <div className="container pb-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-primary p-4 text-white">
                    Recent blogs by {user.name}
                  </h5>
                  {showUserBlogs()}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-primary p-4 text-white">
                    Contact {user.name}
                  </h5>
                  <ContactForm authorEmail={user.email} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

UserProfile.getInitialProps = ({ query }) => {
  return userPublicProfile(query.username).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      //   console.log("GET INITIAL PROPS IN SINGLE BLOG", data);
      return { user: data.user, blogs: data.blogs };
    }
  });
};

export default UserProfile;

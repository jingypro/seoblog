import Link from "next/link";
import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import CreateBlog from "../../../components/crud/BlogCreate";
// import Link from "next/link";

const Blog = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Create a new blog</h2>
            </div>
            <div className="col-md-12">
              <CreateBlog />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default Blog;

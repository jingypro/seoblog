import Layout from "../components/Layout";
import Link from "next/link";

const Index = () => {
  return (
    <Layout>
      <article className="overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-4 font-weight-bold">
                Brilliant Blogs, Tutorials and Articles
              </h1>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center pt-4 pb-5">
              <p className="lead">
                Best blogs, tutorials and articles on anything and nothing
              </p>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <div className="flip flip-horizontal">
                <div
                  className="front"
                  style={{
                    backgroundImage:
                      "url(" +
                      "https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg" +
                      ")",
                  }}
                >
                  <h2 className="text-shadow text-center h1">Blogs</h2>
                </div>
                <div className="back text-center">
                  <Link href="/categories/blog-posts" legacyBehavior>
                    <a>
                      <h3 className="h1">Blogs</h3>
                    </a>
                  </Link>
                  <p className="lead">The world's most popular blogs</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="flip flip-horizontal">
                <div
                  className="front"
                  style={{
                    backgroundImage:
                      "url(" +
                      "https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg" +
                      ")",
                  }}
                >
                  <h2 className="text-shadow text-center h1">Tutorials</h2>
                </div>
                <div className="back text-center">
                  <Link href="/categories/tutotrials" legacyBehavior>
                    <a>
                      <h3 className="h1">Tutorials</h3>
                    </a>
                  </Link>
                  <p className="lead">The worlds most popular tutorials</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="flip flip-horizontal">
                <div
                  className="front"
                  style={{
                    backgroundImage:
                      "url(" +
                      "https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg" +
                      ")",
                  }}
                >
                  <h2 className="text-shadow text-center h1">Articles</h2>
                </div>
                <div className="back text-center">
                  <Link href="/categories/articles" legacyBehavior>
                    <a>
                      <h3 className="h1">Articles</h3>
                    </a>
                  </Link>
                  <p className="lead">
                    A Production ready web framework for writing articles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default Index;

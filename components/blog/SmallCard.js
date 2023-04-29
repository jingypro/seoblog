import Link from "next/link";
import renderHTML from "html-react-parser";
import { parseISO, formatRelative } from "date-fns";
import { API } from "../../config";

const SmallCard = ({ blog }) => {
  return (
    <div className="card">
      <section className="d-flex justify-content-center">
        <Link href={`/blogs/${blog.slug}`}>
          <img
            className="img-fluid"
            style={{
              maxHeight: "150px",
              maxWidth: "100%",
              objectFit: "cover",
            }}
            src={`${API}/blog/photo/${blog.slug}`}
            alt={blog.title}
          />
        </Link>
      </section>
      <div className="card-body">
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <h5 className="card-title">{blog.title}</h5>
          </Link>
          <p className="card-text">{renderHTML(blog.excerpt)}</p>
        </section>
      </div>
      <div className="card-body">
        Posted at {formatRelative(parseISO(blog.updatedAt), new Date())} by{" "}
        <Link href={`/profile/${blog.postedBy.username}`}>
          {blog.postedBy.username}
        </Link>{" "}
      </div>
    </div>
  );
};

export default SmallCard;

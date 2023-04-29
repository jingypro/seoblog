// import Header from "./Header";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("./Header"), {
  ssr: false,
});
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;

import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import NProgress from "nprogress";
import ".././node_modules/nprogress/nprogress.css";
import { APP_NAME } from "../config";
import { signout, isAuth } from "../actions/auth";
import Search from "./blog/Search";
// import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  //   UncontrolledDropdown,
  //   DropdownToggle,
  //   DropdownMenu,
  //   DropdownItem,
} from "reactstrap";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

// //react-bootstrap edition
// //=================================================
// function Header() {
//   return (
//     <Navbar bg="light" expand="md">
//       <Link href="/" passHref legacyBehavior>
//         <Navbar.Brand>{APP_NAME}</Navbar.Brand>
//       </Link>
//       <Navbar.Toggle aria-controls="basic-navbar-nav" />
//       <Navbar.Collapse id="basic-navbar-nav">
//         <Nav className="me-auto">
//           <Link href="/signin" passHref legacyBehavior>
//             <Nav.Link>Signin</Nav.Link>
//           </Link>
//           <Link href="/signup" passHref legacyBehavior>
//             <Nav.Link>Signup</Nav.Link>
//           </Link>
//         </Nav>
//       </Navbar.Collapse>
//     </Navbar>
//   );
// }
// export default Header;
// //=================================================

// reactstrap with passHref, legacyBehavior edition
// =================================================

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Navbar color="light" light expand="md">
        <Link href="/" passHref legacyBehavior>
          <NavLink className="font-weight-bold">{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <>
              <NavItem>
                <Link href="/contact" passHref legacyBehavior>
                  <NavLink>Contact Us</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/blogs" passHref legacyBehavior>
                  <NavLink>Blogs</NavLink>
                </Link>
              </NavItem>
            </>
            {!isAuth() && (
              <>
                <NavItem>
                  <Link href="/signin" passHref legacyBehavior>
                    <NavLink>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup" passHref legacyBehavior>
                    <NavLink>Signup</NavLink>
                  </Link>
                </NavItem>
              </>
            )}

            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link href="/user" passHref legacyBehavior>
                  <NavLink>{`${isAuth().name}'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                <Link href="/admin" passHref legacyBehavior>
                  <NavLink>{`${isAuth().name}'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}
            {isAuth() && (
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  onClick={() => signout(() => Router.replace(`/signin`))}
                >
                  Signout
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              <Link href="/user/crud/blog" passHref legacyBehavior>
                <NavLink className="btn btn-primary text-light">
                  Create Blog
                </NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Search />
    </>
  );
};
// =================================================

export default Header;

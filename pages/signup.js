import Layout from "../components/Layout";
import SignupComponent from "../components/auth/SignupComponent";
// import dynamic from "next/dynamic";
// const SignupComponent = dynamic(
//   () => import("../components/auth/SignupComponent"),
//   {
//     ssr: false,
//   }
// );

const Signup = () => {
  return (
    <Layout>
      <h2 className="text-center pt-4 pb-4">
        Welcome to Writivox! Please sign up.
      </h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SignupComponent />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;

// // import Link from "next/link";
// import { useState, useEffect } from "react";
// import Router from "next/router";
// import { loginWithGoogle, authenticate, isAuth } from "../../actions/auth";
// import jwt_decode from "jwt-decode";
// import { GOOGLE_CLIENT_ID } from "../../config";

// const LoginGoogle = () => {
//   useEffect(() => {
//     // global google */
//     google.accounts.id.initialize({
//       client_id: GOOGLE_CLIENT_ID,
//       callback: responseGoogle,
//     });
//     google.accounts.id.renderButton(document.getElementById("signInDiv"), {
//       theme: "outline",
//       size: "large",
//     });
//   }, []);

//   const responseGoogle = (response) => {
//     console.log(response.credential);
//     const tokenId = response.credential;
//     // console.log(jwt_decode(tokenId));
//     // const user = jwt_decode(tokenId);
//     const user = { tokenId };

//     loginWithGoogle(user).then((data) => {
//       if (data.error) {
//         console.log(data.error);
//       } else {
//         console.log("Authentication data:", data); // Add this line
//         authenticate(data, () => {
//           console.log("Authenticated user:", isAuth()); // Add this line
//           if (isAuth() && isAuth().role === 1) {
//             console.log("Redirecting to /admin"); // Add this line
//             Router.push(`/admin`);
//           } else {
//             console.log("Redirecting to /user"); // Add this line
//             Router.push(`/user`);
//           }
//         });
//       }
//     });
//   };

//   return (
//     <div className="App">
//       <div id="signInDiv"></div>
//     </div>
//   );
// };

// export default LoginGoogle;

import { useState, useEffect, useCallback, useRef } from "react";
import Router from "next/router";
import { loginWithGoogle, authenticate, isAuth } from "../../actions/auth";
import { GOOGLE_CLIENT_ID } from "../../config";

const LoginGoogle = () => {
  const responseGoogleRef = useRef();

  const responseGoogle = useCallback((response) => {
    // console.log("Google response:", response);
    const tokenId = response.credential || response.getAuthResponse().id_token;
    // console.log("Token ID:", tokenId);
    const user = { tokenId };

    // console.log("Calling loginWithGoogle with user:", user); // Add this line

    loginWithGoogle(user).then((data) => {
      if (data.error) {
        // console.log(data.error);
      } else {
        // console.log("Authentication data:", data);
        authenticate(data, () => {
          // console.log("Authenticated user:", isAuth());
          if (isAuth() && isAuth().role === 1) {
            // console.log("Redirecting to /admin");
            Router.push(`/admin`);
          } else {
            // console.log("Redirecting to /user");
            Router.push(`/user`);
          }
        });
      }
    });
  }, []);

  responseGoogleRef.current = responseGoogle;

  const initGoogleLogin = () => {
    if (!google) {
      setTimeout(initGoogleLogin, 100);
      return;
    }

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (responseGoogleRef.current) {
          responseGoogleRef.current(response);
        }
      },
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  };

  useEffect(() => {
    initGoogleLogin();
  }, []);

  return (
    <div className="App">
      <div id="signInDiv"></div>
    </div>
  );
};

export default LoginGoogle;

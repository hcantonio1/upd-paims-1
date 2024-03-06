import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { isLoggedIn } from "../services/auth";

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  // const [userRole, setUserRole] = useState("");
  // useEffect(() => {
  //   getUserRole().then((role) => {
  //     setUserRole(role);
  //   });
  // });
  if (["/app", "/app/"].includes(location.pathname)) {
    navigate("/app/home");
  }
  if (!isLoggedIn() && location.pathname !== `/app/login`) {
    navigate("/app/login");
    return null;
  }

  // const specialRoles = ["Supervisor", "Admin", "Dev"];
  // const specialPaths = ["/app/manageusers"];
  // if (
  //   specialRoles.includes(userRole) &&
  //   specialPaths.includes(location.pathname)
  // ) {
  //   navigate("/app/home");
  //   alert(`Access denied. ${location.pathname}`);
  //   return null;
  // }

  return <Component {...rest} />;
};

export default PrivateRoute;

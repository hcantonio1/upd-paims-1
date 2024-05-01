import React from "react";
import { navigate } from "gatsby";
import { isLoggedIn, getUser } from "../../services/auth";

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const userRole = getUser().role;

  if (!isLoggedIn() && location.pathname !== `/app/login`) {
    navigate("/app/login");
    return null;
  }

  if (["", "/", "/app/"].includes(location.pathname)) {
    navigate("/app/home");
  }

  const specialRoles = ["Supervisor", "Admin", "Dev"];
  const specialPaths = ["/app/manageaccounts/"];
  if (!specialRoles.includes(userRole) && specialPaths.includes(location.pathname)) {
    navigate("/app/home");
    alert(`Access denied. ${location.pathname}`);
    return null;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;

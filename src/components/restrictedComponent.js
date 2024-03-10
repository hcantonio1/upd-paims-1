import React, { useState } from "react";
import { navigate } from "gatsby";
import { isLoggedIn, getUser } from "../services/auth";

const RestrictedComponent = ({ component: Component, ...rest }) => {
  const [userRole, setUserRole] = useState(getUser().role);
  const specialRoles = ["Supervisor", "Admin", "Dev"];
  if (!specialRoles.includes(userRole)) {
    return null;
  }

  return <Component {...rest} />;
};

export default RestrictedComponent;

// import React from "react";
import { getUser } from "../../services/auth";

const RestrictedComponent = ({ children, restrictedRoles }) => {
  const userRole = getUser().role;
  if (restrictedRoles.includes(userRole)) {
    return null;
  }

  return children;
};

export default RestrictedComponent;

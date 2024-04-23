import React, { useState } from "react";
import { navigate } from "gatsby";
import { isLoggedIn, getUser } from "../../services/auth";

const RestrictedComponent = ({ children, restrictedRoles }) => {
  const [userRole, setUserRole] = useState(getUser().role);
  if (restrictedRoles.includes(userRole)) {
    return null;
  }

  return children;
};

export default RestrictedComponent;

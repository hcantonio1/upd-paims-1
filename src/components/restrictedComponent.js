import React, { useState } from "react";
import { navigate } from "gatsby";
import { isLoggedIn, getUser } from "../services/auth";

const RestrictedComponent = (props) => {
  const [userRole, setUserRole] = useState(getUser().role);
  const specialRoles = ["Supervisor", "Admin", "Dev"];
  if (!specialRoles.includes(userRole)) {
    return null;
  }

  return props.children;
};

export default RestrictedComponent;

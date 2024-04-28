import React from "react";
// import App from "./app";
import { navigate } from "gatsby";

export default function IndexPage() {
  navigate("/app/home");

  // alternatively, create the login page here, at the index
  return <></>;
}

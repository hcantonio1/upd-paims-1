import * as React from "react";
import Navbar from "../components/navbar";
import Header from "./header";

const Layout = ({ pageTitle, children }) => {
  return (
    <div className="layout">
      <Header />
      <Navbar />
      <h2> {pageTitle} </h2>
      <div className="content">{children}</div>
      <footer>
        <p>Copyright 2023 Team COLA</p>
      </footer>
    </div>
  );
};

export default Layout;

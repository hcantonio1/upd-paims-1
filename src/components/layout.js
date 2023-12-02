import * as React from "react";
import Navbar from "../components/navbar";
import Header from "./header";
import styles from "../styles/layout.module.css"

const Layout = ({ pageTitle, children }) => {
  return (
    <div>
      <Header />

      <main>
        <aside>
          <Navbar />
        </aside>
        <section>
          <h2> {pageTitle} </h2>
          <div className="content">{children}</div>
        </section>
      </main>

      <footer>
        <p>Copyright 2023 Team COLA</p>
      </footer>
    </div>
  );
};

export default Layout;

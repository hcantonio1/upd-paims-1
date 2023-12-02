import * as React from "react";
import Navbar from "../components/navbar";
import Header from "./header"
import * as styles from "../styles/layout.module.css"

const Layout = ({ pageTitle, children }) => {
  return (
    <html>
      <body>
        <div className={styles.wrapper}>

          <Header />
          <div className={styles.midsection}>
            <aside>
              <Navbar />
            </aside>

            <article className={styles.main}>
              <h2> {pageTitle} </h2>
              <div className="content">{children}</div>
            </article>
          </div>
          <footer>
            <p>Copyright 2023 Team COLA</p>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default Layout;

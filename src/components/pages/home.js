import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import Layout from "../layout";
import * as styles from "../../styles/index.module.css";
import { getUser } from "../../services/auth";


const HomePage = () => {

  return (
    <Layout pageTitle="DASHBOARD">
      <main>
        <div>
         <h1>Hello User!</h1>
          <p>Your profile:</p>
          <ul>
            <li>E-mail: {getUser().email}</li>
          </ul>
        </div>
        <div>
          <p>Changelog (tentative):</p>
        </div>
        <div>

        </div>
      </main>
    </Layout>
  );
};

export default HomePage;

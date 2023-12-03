import * as React from "react";
import Layout from "./layout";
import Seo from "./seo";

const AboutPage = () => {
  return (
    <Layout pageTitle="PAIMS">
      <p>
        Properties, Accountabilities Inventory Management System keeps track of
        the properties of the College of Engineering UPD.
      </p>
      <p>
        A project of Team COLA under M?s. Ligaya Figueroa in CS 191-192 Software
        Engineering course.
      </p>
    </Layout>
  );
};

export const Head = () => <Seo title="About Me" />;

export default AboutPage;

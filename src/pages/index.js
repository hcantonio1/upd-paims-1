import React from "react";
import App from "./app";
import { Link, navigate } from "gatsby";
import { getUser, isLoggedIn } from "../services/auth";
import Layout from "../components/lay-out";

export default function Home() {
  navigate("/app/login");

  // below code is not reached; artifact from tutorial
  return (
    <Layout>
      <h1>Hello {isLoggedIn() ? getUser().name : "world"}!</h1>
      <p>
        {isLoggedIn() ? (
          <>
            You are logged in, so check your{" "}
            <Link to="/app/account">profile</Link>
          </>
        ) : (
          <>
            You should <Link to="/app/login">log in</Link> to see restricted
            content
          </>
        )}
      </p>{" "}
    </Layout>
  );
}

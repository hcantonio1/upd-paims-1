import { navigate } from "gatsby";

// create the default app
import { firebaseApp } from "./firebase-config";

import {
  getAuth,
  signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
} from "firebase/auth";

export const isBrowser = () => typeof window !== "undefined";

export const getUser = () =>
  isBrowser() && sessionStorage.getItem("paimsUser")
    ? JSON.parse(sessionStorage.getItem("paimsUser"))
    : {};

const setUser = (user) =>
  sessionStorage.setItem("paimsUser", JSON.stringify(user));

export const handleLogin = ({ username, password }) => {
  const authentication = getAuth();
  const email = username;
  signInWithEmailAndPassword(authentication, email, password)
    .then((response) => {
      sessionStorage.setItem(
        "Auth Token",
        response._tokenResponse.refreshToken
      );
      setUser({
        username: `paims`,
        name: `upd paims`,
        email: email,
      });
      navigate(`/app/home`);
    })
    .catch((error) => {
      alert("Invalid username or password.");
      console.log(error);
    });
};

export const isLoggedIn = () => {
  const user = getUser();

  return !!user.username;
};

export const logout = (callback) => {
  setUser({});
  callback();
};

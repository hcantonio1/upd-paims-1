import { navigate } from "gatsby";
import { auth, db } from "./firebase-config";
import {
  signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

export const isBrowser = () => typeof window !== "undefined";

export const getUser = () =>
  isBrowser() && sessionStorage.getItem("paimsUser")
    ? JSON.parse(sessionStorage.getItem("paimsUser"))
    : {};

const setUser = (user) =>
  sessionStorage.setItem("paimsUser", JSON.stringify(user));

export const handleLogin = ({ username, password }) => {
  const email = username;
  signInWithEmailAndPassword(auth, email, password)
    .then((response) => {
      sessionStorage.setItem(
        "Auth Token",
        response._tokenResponse.refreshToken
      );
      setUserRole();
    })
    .then(() => {
      setUser({
        username: `paims`,
        role: sessionStorage.getItem("userRole"),
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

export const setUserRole = () => {
  const user = auth.currentUser;
  getDoc(doc(db, "user", user.uid))
    .then((docSnap) => {
      const role = docSnap.data().Role;
      console.log(role);
      sessionStorage.setItem("userRole", role);
    })
    .catch((err) => {
      console.log(err);
    });
};

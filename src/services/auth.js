import { navigate } from "gatsby";
import { auth, db } from "./firebase-config";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
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
  sessionStorage.clear();
  const email = username;
  signInWithEmailAndPassword(auth, email, password)
    .then((response) => {
      sessionStorage.setItem(
        "Auth Token",
        response._tokenResponse.refreshToken
      );
    })
    .then(async () => {
      await setUserRole();
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
  // return !!auth.currentUser;
  const user = getUser();
  return !!user.username;
};

export const logout = (callback) => {
  setUser({});
  callback();
};

// roles
const setUserData = async () => {};

export const setUserRole = async () => {
  const user = auth.currentUser;
  const docSnap = await getDoc(doc(db, "user", user.uid));
  const role = docSnap.data().Role;
  sessionStorage.setItem("userRole", role);
};

export const getUserRole = async () => {
  const user = auth.currentUser;
  const docSnap = await getDoc(doc(db, "user", user.uid));
  return docSnap.data().Role;
};

// onAuthStateChanged(auth, async (user) => {
//   console.log(user);
//   await setUserRole();
//   setUser({
//     username: `paims`,
//     role: sessionStorage.getItem("userRole"),
//     email: user.email,
//   });
// });

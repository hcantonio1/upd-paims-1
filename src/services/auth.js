import { navigate } from "gatsby";
import { auth, db } from "../../firebase-config";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  // createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { fetchCommonData } from "./prefetch";

export const isBrowser = () => typeof window !== "undefined";

export const getUser = () =>
  isBrowser() && sessionStorage.getItem("paimsUser")
    ? JSON.parse(sessionStorage.getItem("paimsUser"))
    : {};

const setUser = (user) =>
  sessionStorage.setItem("paimsUser", JSON.stringify(user));

export const handleLogin = ({ email, password }) => {
  sessionStorage.clear();
  signInWithEmailAndPassword(auth, email, password)
    .then((response) => {
      sessionStorage.setItem(
        "Auth Token",
        response._tokenResponse.refreshToken
      );
    })
    .then(async () => {
      await setUserData();
      await fetchCommonData();
      navigate(`/app/home`);
    })
    .catch((error) => {
      alert("Invalid username or password.");
      console.log(error);
    });
};

export const isLoggedIn = () => {
  const paimsUser = getUser();
  return !!paimsUser.email;
};

export const logout = () => {
  setUser({});
  navigate(`/app/login`);
};

// roles
const setUserData = async () => {
  const currentUser = auth.currentUser;
  const email = auth.currentUser.email;
  const docSnap = await getDoc(doc(db, "user", currentUser.uid));
  const data = docSnap.data();

  setUser({
    user: currentUser,
    email: email,
    role: data.Role,
    firstname: data.FirstName,
    lastname: data.LastName,
    dept: data.Department,
    username: data.Username,
  });
};

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // set/reset user data?
//   } else {
//     // set timeout to clear user data
//   }
// });

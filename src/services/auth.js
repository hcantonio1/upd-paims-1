import { auth, db } from "../../firebase-config";
import {
  signInWithEmailAndPassword,
  signOut,
  // onAuthStateChanged,
  // createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { fetchCommonData } from "./prefetch";

export const isBrowser = () => typeof window !== "undefined";

export const getUser = () => (isBrowser() && sessionStorage.getItem("paimsUser") ? JSON.parse(sessionStorage.getItem("paimsUser")) : {});

const setUser = (user) => sessionStorage.setItem("paimsUser", JSON.stringify(user));

export const handleLogin = async ({ email, password }) => {
  sessionStorage.clear();
  try {
    const authToken = await signInWithEmailAndPassword(auth, email, password);
    sessionStorage.setItem("Auth Token", authToken._tokenResponse.refreshToken);
  } catch (error) {
    console.log("Invalid username or password.", error);
    alert("Invalid username or password.");
    return;
  }
  try {
    await setUserData();
    await fetchCommonData();
  } catch (error) {
    console.log("Error fetching user data.", error);
    alert("Error fetching user data.");
  }
};

export const isLoggedIn = () => {
  const paimsUser = getUser();
  return !!paimsUser.email;
};

export const logout = (callback) => {
  setUser({});
  signOut(auth);
  callback();
};

// roles
const setUserData = async () => {
  const currentUser = auth.currentUser;
  const email = auth.currentUser.email;
  const docSnap = await getDoc(doc(db, "user", email));
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

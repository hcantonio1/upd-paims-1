import { auth, db } from "../../firebase-config";
import {
  signInWithEmailAndPassword,
  signOut,
  // onAuthStateChanged,
  // createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
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
    console.log("Invalid credentials or Network problem", error);
    return { error: "Invalid credentials or Network problem" };
  }
  try {
    await setUserData();
    // console.log("[Prefetch] Pre-fetching column data");
    await fetchCommonData();
    // console.log("[Prefetch] Done Pre-fetching column data");
  } catch (error) {
    console.log("Error fetching user data.", error);
    return { error: "Error fetching user data." };
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
  const buildingSnapped = await getDocs(collection(db, "building"));
  const buildingData = buildingSnapped.docs.map((b) => b.data());

  setUser({
    user: currentUser,
    email: email,
    role: data.Role,
    firstname: data.FirstName,
    lastname: data.LastName,
    dept: data.Department,
    deptBuildings: buildingData.filter((b) => b.Department === data.Department),
  });
};

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // set/reset user data?
//   } else {
//     // set timeout to clear user data
//   }
// });

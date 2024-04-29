import { auth, db } from "../../../firebase-config";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";

export const fetchInventory = async () => {
  // get the user properties and return them in an array
  const currentUser = auth.currentUser;
  if (currentUser == null) return;
  const email = auth.currentUser.email;
  const userSnap = await getDoc(doc(db, "user", email)); // return a DocumentSnap
  const user = userSnap.data();
  const dept = user.Department;
  const role = user.Role;
  const userID = user.UserID;
  const myProperties = await fetchMyProperties(dept, role, userID);
  return myProperties;
};

const fetchMyProperties = async (dept, role, userID) => {
  //   const propertyDocRef = doc(db, "property", "YOUR_PROPERTY_ID");
  const propCollection = collection(db, "property");
  const snapshot = await getDocs(propCollection);
  const propDocs = snapshot.docs.map((doc) => doc.data());

  // if department is Admin
  // if role is Admin
  // if role is Supervisor or Encoder
  if (["Admin", "Supervisor", "Encoder"].includes(role)) {
    const deptAccounts = await fetchMyDeptAccounts(dept);
    // console.log(deptAccounts);
    const IDs = deptAccounts.map((acc) => acc.UserID);
    const deptProps = propDocs.filter((data) => IDs.includes(data.TrusteeID));
    return deptProps;
  }
  if (role === "Trustee") {
    const trusteeProps = propDocs.filter((data) => data.TrusteeID === userID);
    return trusteeProps;
  }
};

const fetchMyDeptAccounts = async (dept) => {
  // console.log(dept);
  const userCollection = collection(db, "user");
  const snapshot = await getDocs(userCollection);
  const users = snapshot.docs.map((doc) => doc.data());
  const myUsers = users.filter((data) => data.Department === dept);
  return myUsers;
};

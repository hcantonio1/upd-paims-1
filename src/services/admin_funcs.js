import { navigate } from "gatsby";
import { auth, db } from "../../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { logout } from "./auth";

/*
Strategy:
1. Check if the account creation is valid.
2. Insert to database.
3. Create account (automatically signs in the new account).
*/
export const createDepartmentAccount = async ({
  role,
  email,
  password,
  lastname,
  firstname,
}) => {
  const accountsData = JSON.parse(sessionStorage.getItem("accountsData"));
  const paimsUser = JSON.parse(sessionStorage.getItem("paimsUser"));
  const dept = paimsUser.dept;

  // get the registered emails
  const registeredEmails = accountsData.map((acc) => acc.Email);
  const emailAlreadyExists = registeredEmails.includes(email);
  if (emailAlreadyExists) {
    return; // its still possible that the email entered is an invalid gmail
  }

  // insert to db
  try {
    await setDoc(doc(db, "user", email), {
      Department: dept,
      Role: role,
      Email: email,
      FirstName: firstname,
      LastName: lastname,
      UserID: accountsData.length + 1,
      Username: "default",
    });
  } catch (err) {
    console.log("Error inserting account to the database.", err.message);
    return;
  }

  // sign the account up
  try {
    const creds = await createUserWithEmailAndPassword(auth, email, password);
    logout(() => {
      navigate(`/app/login`);
    });
  } catch (err) {
    console.log("Error creating account.", err.message);
    return;
  }
};

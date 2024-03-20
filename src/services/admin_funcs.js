import { navigate } from "gatsby";
import { auth, db } from "../../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";

const accountsData = JSON.parse(sessionStorage.getItem("accountsData"));

/*
Strategy:
1. Check if the account creation is valid.
2. Insert to database.
3. Create account (automatically signs in the new account).
*/
export const createDepartmentAccount = async ({
  role,
  dept,
  email,
  password,
  lastname,
  firstname,
}) => {
  // get the registered emails
  const registeredEmails = accountsData.map((acc) => acc.Email);
  const emailAlreadyExists = registeredEmails.includes(email);
  if (emailAlreadyExists) {
    return;
  }

  // insert to db... problem. there is no uuid

  try {
    // const creds = await createUserWithEmailAndPassword(auth, email, password);
    // console.log(creds);
  } catch (err) {
    console.log("Error creating account.", err.message);
  }
};

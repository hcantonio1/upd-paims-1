import { navigate } from "gatsby";
import { auth, db } from "../../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";

export const createDepartmentAccount = ({
  role,
  dept,
  email,
  password,
  lastname,
  firstname,
}) => {};

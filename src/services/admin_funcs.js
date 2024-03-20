import { navigate } from "gatsby";
import { auth, db } from "../../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

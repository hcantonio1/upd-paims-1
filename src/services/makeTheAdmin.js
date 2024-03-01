// it is only possible to make custom claims through the sdk...
/*
    From the docs:
        Custom claims can contain sensitive data, therefore they
        should only be set from a privileged server environment
        by the Firebase Admin SDK.
    
    Especially this file makes it easy to create admins.
    Solution: maybe use firebase/cloud.
*/

/*
 * These are the roles I want:
 *     System Administrator (Owner)
 *     Inventory Supervisor (Department-wide)
 *     Encoder
 *     Property Trustee (Actually not necessary and useful)
 *
 * I make the claim object:
 *     { admin: true,
 *       supervisor: true,
 *       encoder: true,
 *      }
 */

// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyBMLDfZjN-c10riaKLsSbvn2UZZNkunEJk",
//   authDomain: "react-firebase-v9-b1a6f.firebaseapp.com",
//   projectId: "react-firebase-v9-b1a6f",
//   storageBucket: "react-firebase-v9-b1a6f.appspot.com",
//   messagingSenderId: "1089973929613",
//   appId: "1:1089973929613:web:bd6cee73d6ed7db292c4c4",
// };

// initializeApp(firebaseConfig);

// const { initializeApp } = require("firebase-admin/app");
// const admin = initializeApp();
// // give hcantonio1@up.edu.ph all privileges
// console.log(admin);
// admin.auth().setCustomUserClaims("XhsI6SdJJCb9auO6iP3z8IP9xoh1", {
//   admin: true,
//   supervisor: true,
//   encoder: true,
// });

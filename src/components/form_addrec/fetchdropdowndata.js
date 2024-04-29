import { db } from "../../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export const fetchDeptAccounts = async (dept) => {
  try {
    const userCollection = collection(db, "user");
    const snapshot = await getDocs(userCollection);
    const users = snapshot.docs.map((doc) => doc.data());
    const myUsers = users.filter((data) => data.Department === dept);
    return myUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const fetchCategories = async () => {
  try {
    const categoryCollection = collection(db, "item_category");
    const snapshot = await getDocs(categoryCollection);
    const categories = snapshot.docs.map((doc) => doc.data());
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

export const fetchDeptLocations = async () => {
  try {
    const locationCollection = collection(db, "item_location");
    const snapshot = await getDocs(locationCollection);
    const locations = snapshot.docs.map((doc) => doc.data());
    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
};

export const fetchStatuses = async () => {
  try {
    const statusCollection = collection(db, "status");
    const snapshot = await getDocs(statusCollection);
    const statuses = snapshot.docs.map((doc) => doc.data());
    return statuses;
  } catch (error) {
    console.error("Error fetching statuses:", error);
  }
};

export const fetchTypes = async () => {
  try {
    const typeCollection = collection(db, "doctype");
    const snapshot = await getDocs(typeCollection);
    const types = snapshot.docs.map((doc) => doc.data());
    return types;
  } catch (error) {
    console.error("Error fetching types:", error);
  }
};

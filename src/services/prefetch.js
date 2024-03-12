import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

const commonCollections = [
  {
    name: "item_category",
    columnNameOfID: "CategoryID",
    valuesToFetch: ["CategoryName"],
  },
  {
    name: "item_location",
    columnNameOfID: "LocationID",
    valuesToFetch: ["Building", "RoomNumber"],
  },
  {
    name: "status",
    columnNameOfID: "StatusID",
    valuesToFetch: ["StatusName"],
  },
];

const prefetched = {};

export const fetchCommonData = async () => {
  commonCollections.forEach(async ({ name, columnNameOfID, valuesToFetch }) => {
    console.log(`Fetching ${name}`);
    try {
      prefetched[name] = {};
      const collSnap = await getDocs(collection(db, name));
      collSnap.docs.forEach((doc) => {
        const data = doc.data();
        const key = data[columnNameOfID];
        const values = valuesToFetch.map((column) => {
          // console.log(column);
          return data[column];
        });
        prefetched[name][key] = values[0];
        if (name == "item_location") {
          prefetched[name][key] = `${values[0]} ${values[1]}`;
        }
      });
    } catch (err) {
      console.log(`Error fetching ${name}. ${err}`);
    }
  });
  console.log(prefetched);
};

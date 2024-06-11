import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

export const commonCollections = [
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
  // {
  //   name: "purchase_order",
  //   columnNameOfID: "PurchaseOrderID",
  //   valuesToFetch: ["TotalCost"],
  // },
  {
    name: "supplier",
    columnNameOfID: "SupplierID",
    valuesToFetch: ["SupplierName"],
  },
  {
    name: "user",
    columnNameOfID: "UserID",
    valuesToFetch: ["UserID"],
  },
  {
    name: "item_document",
    columnNameOfID: "DocumentID",
    valuesToFetch: ["Link"],
  },
];

const prefetched = {};

const fetchCollData = async ({ name, columnNameOfID, valuesToFetch }) => {
  // console.log(`Fetching ${name}`);
  try {
    prefetched[name] = {};
    const collSnap = await getDocs(collection(db, name));
    collSnap.docs.forEach((doc) => {
      const data = doc.data();
      console.log("ok what am i looking at", data);
      const key = data[columnNameOfID];
      console.log("COLUMN", columnNameOfID, "CHECK KEYS", key);
      const values = valuesToFetch.map((column) => {
        return data[column];
      });
      prefetched[name][key] = values[0];
      if (name === "item_location") {
        prefetched[name][key] = `${values[0]} ${values[1]}`;
      }
    });
  } catch (err) {
    console.log(`Error fetching ${name}. ${err}`);
  }
};

export const fetchCommonData = async () => {
  const promises = [];
  commonCollections.forEach(async (coll) => {
    promises.push(fetchCollData(coll));
  });
  Promise.all(promises).then(() => {
    // console.log(prefetched);
    // console.log(JSON.stringify(prefetched));
    sessionStorage.setItem("prefetched", JSON.stringify(prefetched));
  });
};

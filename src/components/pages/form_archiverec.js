// Step 1: Import React
import * as React from "react";
import { Link } from "gatsby";
import Layout from "../layout";
import { useState } from "react";
import { db, storage } from "../../../firebase-config";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const ArchiveRec = () => {
  const [archiveData, setArchiveData] = useState({
    PropertyID: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [textInput, setTextInput] = useState("");

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const fetchArchiveData = async (archiveId) => {
    try {
      const arcRef = doc(db, "property", archiveId);
      const arcSnap = await getDoc(arcRef);

      if (arcSnap.exists()) {
        const arcData = arcSnap.data();
        if (arcData.isArchived === 0) {
          setButtonDisabled(false);
        } else {
          setButtonDisabled(true);
        }
        setArchiveData((prevData) => ({
          ...prevData,
          isArchived: arcData.isArchived,
        }));
      }
      if (!arcSnap.exists()) {
        setButtonDisabled(false);
        setArchiveData((prevData) => ({
          ...prevData,
          isArchived: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching archived:", error);
    }
  };

  const handleArchive = async (e) => {
    e.preventDefault();

    try {
      const archiveRef = doc(db, "property", archiveData.PropertyID);
      await updateDoc(archiveRef, {
        isArchived: 1,
      });
      alert("Successfully archived!");
      window.location.reload();
    } catch (error) {
      console.error("Error archiving:", error);
      alert("Failed to archive.");
    }
  };

  const handleArchiveChange = (e) => {
    setArchiveData({
      ...archiveData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "PropertyID") {
      fetchArchiveData(e.target.value);
    }
  };

  return (
    <Layout pageTitle="ARCHIVE A RECORD">
      <main>
        <Link to="/app/submitform/">Return to Submit Form Page</Link>
        <h2>Archive a record</h2>
        <p>
          Will only pretty much just change archive status in property table. If
          record is already archived, will say so in console.
        </p>
        <form onSubmit={handleArchive}>
          <div>
            <p>Archive a record</p>
            <label
              htmlFor="PropertyID"
              style={{
                display: "inline-block",
                width: "150px",
                verticalAlign: "top",
              }}
            >
              Property ID<span style={{ color: "red" }}>*</span>:{" "}
            </label>
            <input
              type="text"
              name="PropertyID"
              value={archiveData.PropertyID}
              onChange={handleArchiveChange}
              style={{ width: "300px", display: "inline-block" }}
              pattern="[0-9]*"
              title="Numbers only."
              required
            />
            <br />
            <label
              htmlFor="isArchived"
              style={{
                display: "inline-block",
                width: "150px",
                verticalAlign: "top",
              }}
            >
              Current Archive Status<span style={{ color: "red" }}></span>:{" "}
            </label>
            <input
              type="text"
              name="isArchived"
              value={archiveData.isArchived}
              onChange={handleArchiveChange}
              style={{ width: "300px", display: "inline-block" }}
              readOnly={true}
            />
          </div>
          <button type="submit" disabled={buttonDisabled}>
            Submit
          </button>
        </form>
      </main>
    </Layout>
  );
};

// You'll learn about this in the next task, just copy it for now
export const Head = () => <title>Archive Property</title>;

// Step 3: Export your component
export default ArchiveRec;

//personal notes
//current problems with adding record:
//lengthy process if doing it one by one per property
//current problems with updating record:
//

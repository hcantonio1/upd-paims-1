import React, { useEffect, useState } from "react";
import _ from "lodash";
import { doc, updateDoc, setDoc, Timestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../../firebase-config";
import { fetchDeptLocations, fetchDeptUsers, fetchStatuses, fetchCategories } from "../../fetchutils/fetchdropdowndata";

import { PaimsForm, FormSubheadered, FormRow, SubmitButton } from "../paimsform/paimsForm";
import SmallTextField from "../paimsform/smallTextField";
import { AggregatedFormSelect } from "../paimsform/formSelect";
import FormDatePicker from "../paimsform/formDatePicker";

import dayjs from "dayjs";
import { fetchDocumentAutofill, fetchPropertyAutofill } from "../../fetchutils/formautofill";
import { getUser } from "../../services/auth.js";

const ReportGeneration = () => {
    const [formData, setFormData] = useState({
        StatusIDs: "",
        TrusteeIDs: "",
        LocationIDs: "",
        StartDate: null,
        EndDate: null,
        CategoryIDs: "",
        SupplierIDs: "",
    });

    const [users, setUsers] = useState([]);
    const [locations, setLocations] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchdropdowndata = async () => {
            setUsers(await fetchDeptUsers());
            setLocations(await fetchDeptLocations());
            setStatuses(await fetchStatuses());
            setCategories(await fetchCategories());
        };
        fetchdropdowndata();
    }, []);

    const handleInputChange = (e) => {
        // MUI Select sends an object target={name, value} as opposed to regular onChange which sends a target=HTML
        const formDataKey = e.target.name !== "" ? e.target.name : e.target.id;
        setFormData({ ...formData, [formDataKey]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //try {

        //};
    };

    return (
        <PaimsForm header="Generate Report" onSubmit={handleSubmit}>
            <FormSubheadered subheader="Date Range">
                <FormRow segments={3}>
                    <FormDatePicker
                        id="Start Date"
                        label="Start Date"
                        value={formData.StartDate}
                        onChange={(val) => {
                            setFormData({
                                ...formData,
                                StartDate: val,
                            });
                        }}
                    />
                    <FormDatePicker
                        id="End Date"
                        label="End Date"
                        value={formData.EndDate}
                        onChange={(val) => {
                            setFormData({
                                ...formData,
                                EndDate: val,
                            });
                        }}
                    />
                </FormRow>
            </FormSubheadered>
            <FormSubheadered subheader="Other options">
                    {/* 
                    <FormRow segments={3}>
                    add multiple checkmark select for (https://mui.com/material-ui/react-select/#checkmarks):
                    - categories
                    - statuses
                    - trustees
                    - locations
                    - suppliers
                    </FormRow>
                    */}
            </FormSubheadered>
        </PaimsForm>
    );
}

export default ReportGeneration;
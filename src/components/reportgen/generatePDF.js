import _ from "lodash";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePdf = ({ date, categories, department, properties }) => {
  const titleAndFields = formatTitleAndFields(date, categories, department);

  const tableAndSigs = formatTableAndSigs(properties);

  const dd = {
    pageOrientation: "landscape",
    pageSize: "A4",
    pageMargins: [15, 40, 15, 0],
    defaultStyle: { fontSize: 8 },
    styles: {
      header: {
        fontSize: 14,
        bold: true,
      },
      tableheader: {
        alignment: "center",
        bold: true,
        fontSize: 8,
      },
      tableheader_quantity: {
        alignment: "center",
        fontSize: 6,
      },
      tablecell: {
        fontSize: 6,
        alignment: "center",
      },
    },
    content: [...titleAndFields, tableAndSigs],
  };

  pdfMake.createPdf(dd).open();
};

// spaces
const sixspc = "      ";
const twelvespc = "            ";
const _24spc = `${twelvespc}${twelvespc}`;
const _48spc = `${_24spc}${_24spc}`;
const _96spc = `${_48spc}${_48spc}`;
const emptyTableCell = { text: "", style: "tablecell" };
const emptyTableRow = Array(10).fill(emptyTableCell);

// repeating page title and fields
const formatTitleAndFields = (date, categories, department) => {
  const fields = formatFieldData(date, categories, department);
  return [
    {
      text: "REPORT ON THE PHYSICAL COUNT OF PROPERTY, PLANT AND EQUIPMENT",
      style: "header",
      alignment: "center",
    },
    {
      text: `\n${twelvespc}${fields.category}${twelvespc}`,
      alignment: "center",
      decoration: "underline",
    },
    {
      text: "(Type of Property, Plant and Equipment)",
      alignment: "center",
    },
    {
      text: ["\nAs of ", { text: `${twelvespc}${fields.date}${twelvespc}`, decoration: "underline" }, "      "],
      alignment: "center",
    },
    {
      text: ["\nEntity Name : ", { text: `${sixspc}${fields.department}${sixspc}`, decoration: "underline" }],
    },
    {
      text: ["Fund Cluster: ", { text: `${_48spc}`, decoration: "underline" }],
    },
    {
      text: [
        "For which ",
        { text: `${_48spc}`, decoration: "underline" },
        `${sixspc}`,
        { text: `${_48spc}`, decoration: "underline" },
        `${sixspc}`,
        { text: `${_48spc}`, decoration: "underline" },
        " is accountable, having assumed such accountability on",
        `${twelvespc}`,
        { text: `${_48spc}`, decoration: "underline" },
      ],
    },
    {
      text: [
        `............(Name of Accountable Officer)`,
        `${twelvespc}`,
        "(Official Designation)",
        `${twelvespc}${sixspc}   `,
        "(Entity Name)",
        `${_48spc}${_48spc}${_24spc}${sixspc}   `,
        "(Date of Assumption)",
      ],
    },
  ];
};

const formatFieldData = (dateGenerated, categories, department) => {
  console.log(categories);
  const dateGeneratedOptions = { year: "numeric", month: "long", day: "numeric" };
  const dateGeneratedStr = dateGenerated.toLocaleDateString("en-US", dateGeneratedOptions);
  const category = categories.length === 1 ? categories[0] : null;
  const fields = {
    date: dateGeneratedStr,
    department: department,
    category: !!category ? `${category.CategoryID} - ${category.CategoryName}` : "Multiple Categories",
  };
  return fields;
};

// create Table consisting of headers, content, and signatures
const formatTableAndSigs = (properties) => {
  const [row1, row2] = formatTableHeaderRows();
  const tableItems = formatTableItems(properties);
  const tableSigs = formatSigsToTable();
  return {
    table: {
      headerRows: 2,
      widths: [170, 170, "*", "*", "*", "*", "*", "*", "*", "*"],
      heights: 6,
      body: [row1, row2, ...tableItems, tableSigs],
    },
  };
};

const formatTableHeaderRows = () => {
  const tableHeaders = [
    "ARTICLE",
    "DESCRIPTION",
    "PROPERTY NUMBER",
    "UNIT OF MEASURE",
    "UNIT VALUE",
    "QUANTITY per PROPERTY CARD",
    "QUANTITY per PHYSICAL COUNT",
    "SHORTAGE/OVERAGE",
    "placeholder",
    "REMARKS",
  ];
  const tableHeaders2 = ["", "", "", "", "", "", "", "Quantity", "Value", ""];

  const headerRow = tableHeaders.map((header) => {
    if (header.startsWith("QUANTITY")) return { text: header, style: "tableheader_quantity", rowSpan: 2 };
    if (header.startsWith("SHORTAGE")) return { text: header, alignment: "center", bold: true, fontSize: 8, colSpan: 2, rowSpan: 1 };
    return { text: header, style: "tableheader", rowSpan: 2 };
  });

  const headerRow1 = tableHeaders2.map((header) => {
    return { text: header, style: "tableheader" };
  });

  return [headerRow, headerRow1];
};

const formatTableItems = (properties) => {
  const propertyRowOrder = ["PropertyName", "PropertyName", "PropertyID"];
  let output = properties.map((p) => _.at(p, propertyRowOrder));
  output = output.map((row) => {
    return row.slice(0, 3).concat(["only", "", "1", "1", "", "", ""]);
  });
  output = output.concat(_.times(25 - output.length, () => emptyTableRow));

  output = output.map((prop) =>
    prop.map((entry) => {
      return { text: entry, style: "tablecell" };
    })
  );

  return output;
};

const formatSigsToTable = () => {
  const tableSigsBody = [
    ["", "", ""],
    ["Certified Correct by:", "Approved by:", "Verified by:"],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    [
      { text: `${_96spc}${_48spc}`, decoration: "underline" },
      { text: `${_96spc}${_48spc}`, decoration: "underline" },
      { text: `${_96spc}${_48spc}`, decoration: "underline" },
    ],
    [
      `Signature over Printed Name of Inventory Committee Chair and Members`,
      "Signature over Printed Name of Head of Agency/Entity or Authorized Representative",
      "Signature over Printed Name of COA Representative",
    ],
  ];

  const tableSigs = [
    {
      layout: "noBorders",
      table: {
        widths: ["*", "*", "*"],
        heights: 6,
        body: tableSigsBody.map((row) => {
          return row.map((entry) => {
            return { text: entry, style: "tablecell" };
          });
        }),
      },
      colSpan: 10,
    },
  ];

  return tableSigs;
};

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateReport = (e) => {
  const dd = {
    content: [],
    // styles: {}
  };

  pdfMake.createPdf(dd).open();
};

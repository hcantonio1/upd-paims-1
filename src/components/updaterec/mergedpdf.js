import { PDFDocument } from "pdf-lib";

export function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

export async function copyPages(url1, url2) {
  const firstDonorPdfBytes = await fetch(url1).then((res) => res.arrayBuffer());
  const secondDonorPdfBytes = await fetch(url2).then((res) => res.arrayBuffer());

  const mergedPdf = await PDFDocument.create();

  const pdfA = await PDFDocument.load(firstDonorPdfBytes);
  const pdfB = await PDFDocument.load(secondDonorPdfBytes);

  const copiedPagesA = await mergedPdf.copyPages(pdfA, pdfA.getPageIndices());
  copiedPagesA.forEach((page) => mergedPdf.addPage(page));

  const copiedPagesB = await mergedPdf.copyPages(pdfB, pdfB.getPageIndices());
  copiedPagesB.forEach((page) => mergedPdf.addPage(page));

  const mergedPdfFile = await mergedPdf.save();
  return mergedPdfFile;
}

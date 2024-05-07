const PDFParser = require('pdf-parse');

exports.extractTextFromPDFBuffer = async (pdfBuffer) => {
  const data = await PDFParser(pdfBuffer);
  return data.text;
};

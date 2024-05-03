const PDFParser = require('pdf-parse');

async function extractTextFromPDFBuffer(pdfBuffer) {
  const data = await PDFParser(pdfBuffer);
  return data.text;
}

module.exports = {
  extractTextFromPDFBuffer,
};

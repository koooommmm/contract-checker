const pdfService = require('../services/pdfService');
const firebaseService = require('../services/firebaseService');
const textExtractionService = require('../services/textExtractionService');

exports.uploadFile = async (req, res) => {
  const userId = req.query.userId;

  if (!req.files || !(req.files.wordFile || req.files.pdfFile)) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    let pdfBuffer;
    if (req.files.wordFile) {
      pdfBuffer = await pdfService.convertToPdf(req.files.wordFile.data);
    } else {
      pdfBuffer = req.files.pdfFile.data;
    }
    const extractedText = await textExtractionService.extractTextFromPDFBuffer(
      pdfBuffer
    );
    const fileUrl = await firebaseService.uploadToFirebase(pdfBuffer, userId);
    res.send({ fileUrl, extractedText });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

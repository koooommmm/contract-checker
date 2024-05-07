const pdfService = require('../services/pdfService');
const firebaseService = require('../services/firebaseService');
const textExtractionService = require('../services/textExtractionService');
const chatGptService = require('../services/chatGptService');

exports.uploadFile = async (req, res) => {
  if (!req.files || !(req.files.wordFile || req.files.pdfFile)) {
    return res.status(400).send('No file uploaded.');
  }

  const userId = req.query.userId;
  const file = req.files.wordFile || req.files.pdfFile;

  try {
    const pdfBuffer = req.files.wordFile
      ? await pdfService.convertToPdf(file.data)
      : file.data;

    const extractedText = await textExtractionService.extractTextFromPDFBuffer(
      pdfBuffer
    );
    const fileUrl = await firebaseService.uploadToFirebase(pdfBuffer, userId);
    const riskAnalysis = await chatGptService.analyzeContractRisk(
      extractedText
    );

    res.json({ fileUrl, riskAnalysis });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const pdfService = require('../services/pdfService');
const firebaseService = require('../services/firebaseService');
const textExtractionService = require('../services/textExtractionService');
const chatGptService = require('../services/chatGptService');

exports.getContractByUserId = async (req, res) => {
  try {
    const userId = req.userId;
    const contracts = await firebaseService.getContractsByUserId(
      'contracts',
      userId
    );
    res.status(200).json(contracts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    await firebaseService.deleteFileFromStorage(req.body.filePath);
    await firebaseService.deleteDocument('contracts', req.body.contractId);
    res.status(200).json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateFile = async (req, res) => {
  try {
    await firebaseService.updateDocumentTitle(
      'contracts',
      req.body.contractId,
      req.body.newTitle
    );
    res.status(200).json({ message: 'File updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const file = req.files.file;
  try {
    const pdfBuffer = await pdfService.convertToPdf(file.data);
    const extractedText = await textExtractionService.extractTextFromPDFBuffer(
      pdfBuffer
    );
    const riskAnalysis = await chatGptService.analyzeContractRisk(
      extractedText
    );

    const filePath = `user_uploads/${req.userId}/${Date.now()}.pdf`;
    const fileUrl = await firebaseService.uploadToFirebaseStorage(
      pdfBuffer,
      filePath
    );

    const documentJson = {
      userId: req.userId,
      title: file.name,
      createdAt: Date.now(),
      alerts: riskAnalysis,
      pdf: fileUrl,
      filePath: filePath,
    };

    const id = await firebaseService.addDocument('contracts', documentJson);
    res.json({ id, fileUrl, riskAnalysis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

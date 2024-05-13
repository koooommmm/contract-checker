const pdfService = require('../services/pdfService');
const firebaseService = require('../services/firebaseService');
const textExtractionService = require('../services/textExtractionService');
const chatGptService = require('../services/chatGptService');

const verifyIdToken = async (req, res) => {
  // トークンの確認
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Authentication token is required.');
  }

  // トークンの検証
  const { isValid, userId, error } = await firebaseService.verifyIdToken(token);
  if (!isValid) {
    return res
      .status(403)
      .send('Invalid token: ' + (error.message || 'Unknown error'));
  } else {
    return userId;
  }
};

exports.deleteFile = async (req, res) => {
  const userId = await verifyIdToken(req, res);

  try {
    await firebaseService.deleteFileFromStorage(req.body.filePath);
    await firebaseService.deleteDocument('contracts', req.body.contractId);
    res.status(200).send('File deleted successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.updateFile = async (req, res) => {
  const userId = await verifyIdToken(req, res);

  try {
    await firebaseService.updateDocumentTitle(
      'contracts',
      req.body.contractId,
      req.body.newTitle
    );
    res.status(200).send('File updated successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

exports.uploadFile = async (req, res) => {
  const userId = await verifyIdToken(req, res);

  // ファイルの存在確認
  if (!req.files) {
    return res.status(400).send('No file uploaded.');
  }

  const file = req.files.file;

  try {
    const pdfBuffer = req.files.file
      ? await pdfService.convertToPdf(file.data)
      : file.data;

    const extractedText = await textExtractionService.extractTextFromPDFBuffer(
      pdfBuffer
    );
    const riskAnalysis = await chatGptService.analyzeContractRisk(
      extractedText
    );

    const filePath = `user_uploads/${userId}/${Date.now()}.pdf`;
    const fileUrl = await firebaseService.uploadToFirebaseStorage(
      pdfBuffer,
      filePath
    );

    const documentJson = {
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
    res.status(500).send(error.message);
  }
};

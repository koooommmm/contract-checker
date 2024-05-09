const pdfService = require('../services/pdfService');
const firebaseService = require('../services/firebaseService');
const textExtractionService = require('../services/textExtractionService');
const chatGptService = require('../services/chatGptService');

exports.uploadFile = async (req, res) => {
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
  }

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

    const fileUrl = await firebaseService.uploadToFirebaseStorage(
      pdfBuffer,
      userId
    );

    const documentJson = {
      title: file.name,
      createdAt: Date.now(),
      pdf: fileUrl,
      alerts: riskAnalysis,
    };

    const id = await firebaseService.addDocument('contracts', documentJson);

    res.json({ id, fileUrl, riskAnalysis });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

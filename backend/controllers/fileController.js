const pdfService = require('../services/pdfService');
const firebaseService = require('../services/firebaseService');
const textExtractionService = require('../services/textExtractionService');
const chatGptService = require('../services/chatGptService');

exports.uploadFile = async (req, res) => {
  const userId = req.query.userId;

  if (!req.files || !(req.files.wordFile || req.files.pdfFile)) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // PDFの読み込み
    let pdfBuffer;
    if (req.files.wordFile) {
      pdfBuffer = await pdfService.convertToPdf(req.files.wordFile.data);
    } else {
      pdfBuffer = req.files.pdfFile.data;
    }

    // テキストの抽出
    const extractedText = await textExtractionService.extractTextFromPDFBuffer(
      pdfBuffer
    );
    const fileUrl = await firebaseService.uploadToFirebase(pdfBuffer, userId);

    // ChatGPTでリスク解析を実行
    const riskAnalysis = await chatGptService.analyzeContractRisk(
      extractedText
    );

    // JSON形式でレスポンスを返却
    res.json({ fileUrl, riskAnalysis });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const pdfService = require('../services/pdfService');
const firebaseService = require('../services/firebaseService');

exports.uploadFile = async (req, res) => {
  const userId = req.query.userId;

  if (!req.files || !req.files.wordFile) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const pdfBuffer = await pdfService.convertToPdf(req.files.wordFile.data);
    const fileUrl = await firebaseService.uploadToFirebase(pdfBuffer, userId);
    res.send({ fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

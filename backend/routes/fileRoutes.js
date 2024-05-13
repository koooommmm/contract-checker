const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', fileController.uploadFile);
router.post('/delete', fileController.deleteFile);
router.post('/update', fileController.updateFile);

module.exports = router;

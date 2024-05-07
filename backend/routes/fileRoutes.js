const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', fileController.uploadFile);

module.exports = router;

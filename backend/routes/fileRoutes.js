const express = require('express');
const authenticate = require('../middleware/authenticate');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.get('/', authenticate, fileController.getContractByUserId);
router.post('/delete', authenticate, fileController.deleteFile);
router.post('/update', authenticate, fileController.updateFile);
router.post('/upload', authenticate, fileController.uploadFile);

module.exports = router;

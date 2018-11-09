const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const multer = require('multer');
const upload = multer();

router.get('/users', apiController.users);
router.post('/users', upload.fields([]), apiController.addData);

module.exports = router;
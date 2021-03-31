const express = require('express');
const router = express.Router();
const globalController = require('../controllers/global.controller');

router.get('/', globalController.home);

module.exports = router;
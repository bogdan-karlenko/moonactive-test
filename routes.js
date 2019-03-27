const express = require('express');
const router = express.Router();

const echoAtTime = require('./controller');

router.post('/echoAtTime', echoAtTime);

module.exports = router;

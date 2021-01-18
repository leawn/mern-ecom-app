const express = require('express');

const router = express.Router();

//middleware
const { authCheck } = require('../middleware/auth');

//controller
const { corupUser } = require('../controllers/auth');

router.post('/corup-user', authCheck, corupUser);

module.exports = router;
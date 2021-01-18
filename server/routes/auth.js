const express = require('express');

const router = express.Router();

//middleware
const { authCheck } = require('../middleware/auth');

//controller
const { corupUser, currentUser } = require('../controllers/auth');

router.post('/corup-user', authCheck, corupUser);
router.post('/current-user', authCheck, currentUser);

module.exports = router;
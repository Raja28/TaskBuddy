const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/auth');

router.get("/signup", auth)

module.exports = router
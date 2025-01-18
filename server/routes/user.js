
const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/verifyToken');
const { createTask, updateTask, deleteTask } = require('../controller/user');

router.post('/addTask', verifyToken, createTask)
router.post('/updateTask', verifyToken, updateTask)
router.post('/deleteTask', verifyToken, deleteTask)

module.exports = router
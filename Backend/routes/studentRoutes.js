
const { getAllcandidates } = require('../controllers/studentController');

const express = require('express');
const router = express.Router();


//routes


//get all candidates
router.get('/candidateList',getAllcandidates)
 // Import studentController


module.exports = router;
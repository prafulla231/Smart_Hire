
const { getAllcandidates } = require('../controllers/studentController');
const {studentSignUp} = require('../controllers/userController');

const express = require('express');
const router = express.Router();


//routes


//get all candidates
// router.get('/candidateList',getAllcandidates)

// //Adding user to database
// router.get('/addCandidate',studentSignUp)
//  // Import studentController


router.route('/candidateList').get(getAllcandidates);

router.route('/addCandidate').post(studentSignUp);

module.exports = router;
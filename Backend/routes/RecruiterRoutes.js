
const {recruiterSignup} = require('../controllers/userController');

const express = require('express');
const router = express.Router();


//routes


//get all candidates
// router.get('/candidateList',getAllcandidates)

// //Adding user to database
// router.get('/addCandidate',studentSignUp)
//  // Import studentController

router.route('/AddRecruiter').post(recruiterSignup);


module.exports = router;
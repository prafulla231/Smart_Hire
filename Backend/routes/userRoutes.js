
const {userLogin} = require('../controllers/userController');

const express = require('express');
const router = express.Router();


//routes

router.route('/userLogin').post(userLogin);

module.exports = router;
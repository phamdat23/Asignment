var express = require('express');
var router = express.Router();
const acc = require('../controllers/account.controller')
const checkLogin = require('../middleware/checkLogin')
const multer = require('multer')
const upload = multer({dest:"./tmp"})
/* GET home page. */
router.get('/',acc.signupLayout);
router.post('/',upload.single('photo'),acc.signup);

module.exports = router;
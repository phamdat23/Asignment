var express = require('express');
var router = express.Router();
const acc = require('../controllers/account.controller')
const checkLogin = require('../middleware/checkLogin')
const multer = require('multer')
const upload = multer({dest:"./tmp"})
/* GET home page. */
router.get('/', checkLogin.requessLogin,acc.setting);
router.get('/update/:id' ,checkLogin.requessLogin,acc.updateAccount);
router.post('/update/:id',upload.single('image'),checkLogin.requessLogin,acc.updateAccount);
router.get('/logout',checkLogin.requessLogin,acc.logout);
module.exports = router;
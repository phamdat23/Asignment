var express = require('express');
var router = express.Router();
const acc = require('../controllers/account.controller')
const checkLogin = require('../middleware/checkLogin')

/* GET home page. */
router.get('/', checkLogin.NotRequessLogin,acc.signinLayout);
router.post('/',checkLogin.NotRequessLogin,acc.login)
module.exports = router;

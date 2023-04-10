var express = require('express');
var router = express.Router();
const listProduct= require('../controllers/listProduct.controller')
const user = require('../controllers/user.controller')
const checkLogin = require('../middleware/checkLogin')

/* GET home page. */
router.get('/',checkLogin.requessLogin, listProduct.getListProduct);
router.get('/',checkLogin.requessLogin, user.countUser);
router.delete('/:id',checkLogin.requessLogin,listProduct.delete);
router.get('/product/detail',checkLogin.requessLogin, listProduct.detail);
module.exports = router;
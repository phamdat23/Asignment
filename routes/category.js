var express = require('express');
var router = express.Router();

const checkLogin = require('../middleware/checkLogin')
const categoryCtrl = require('../controllers/category.controller')
/* GET home page. */
router.get('/', checkLogin.requessLogin, categoryCtrl.getListCategory)
router.post('/', checkLogin.requessLogin, categoryCtrl.addCategory)
router.get('/edit/:id', checkLogin.requessLogin, categoryCtrl.putCategory)
router.post('/edit/:id', checkLogin.requessLogin, categoryCtrl.putCategory)
router.get('/search',checkLogin.requessLogin, categoryCtrl.filte);
module.exports = router;
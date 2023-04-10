var express = require('express');
var router = express.Router();
const apiCtrl = require('../API/account.api')
const apiPro = require('../API/product.api')
const mdw = require('../middleware/api-auth.middleware')
/* GET home page. */
// api Account
router.post("/account/login", apiCtrl.login)
router.post('/account/reg', apiCtrl.signUp)
router.put('/account/:id',mdw.api_auth , apiCtrl.updateAccount)
router.get('/account/:id',mdw.api_auth , apiCtrl.getAccount)
router.get('/account', apiCtrl.checkUserame)
// api category
router.get('/category', apiPro.getListCategory);
// api product
//http://localhost:3000/api/product
router.get('/product', apiPro.getListProduct)
router.get('/product/:id', apiPro.getProduct)
//http://localhost:3000/api/product?_embed= idcat
router.get('/product', apiPro.getListProductbyCategory)
//http://localhost:3000/api/product
router.post('/product', apiPro.addProduct);
//http://localhost:3000/api/product/:id
router.put('/product/:id', apiPro.putProduct);
//http://localhost:3000/api/product/:id
router.delete('/product/:id', apiPro.deletePro);
// api đơn hàng
//http://localhost:3000/api/donHang/:id
router.get('/donHang/:id',mdw.api_auth, apiPro.getListHDbyIdUserStatus)
//http://localhost:3000/api/donHang
router.post('/donHang',mdw.api_auth, apiPro.addDonHang)
//http://localhost:3000/api/donHang/:id
router.put('/donHang/:id',mdw.api_auth, apiPro.putDonHang)
//http://localhost:3000/api/donHang/:id
router.delete('/donHang/:id',mdw.api_auth, apiPro.destroyDonHang)
module.exports = router;
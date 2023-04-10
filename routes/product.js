var express = require('express');
var router = express.Router();
const product = require('../controllers/listProduct.controller')
const multer = require('multer')
const upload = multer({dest:"./tmp"})
/* GET home page. */
router.get('/', product.getListProduct2)
router.post('/',upload.single('image'), product.addProduct);
router.get('/edit/:id',product.put);
router.post('/edit/:id',upload.single('image'),product.put);
router.delete('/:id',product.delete)
router.get('/detail/:id', product.detail);
router.get('/search', product.filte);
module.exports = router;
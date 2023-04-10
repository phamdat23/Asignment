var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller')
const checkLogin = require('../middleware/checkLogin')
const multer = require('multer')
const upload = multer({dest:"./tmp"})
router.use(checkLogin.requessLoginRole);
/* GET users listing. */
router.get('/',checkLogin.requessLoginRole,userController.listUser);
router.post('/',upload.single('image'), userController.add);
router.get("/edit/:id",userController.put)
router.post("/edit/:id",upload.single('image'), userController.put)
router.delete('/:id',checkLogin.requessLogin, userController.delete);
router.get('/detail/:id',userController.detail);
router.get('/search',userController.filte);
module.exports = router;

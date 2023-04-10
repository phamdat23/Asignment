const ModelPro = require('../models/Product.model')
const ModelHD = require('../models/DonHang.model')
exports.getListProduct = async (req, res, next) => {
    let dataReturn = {
        status: 200,
        msg: "lấy list product"
    }
    try {
        let list = await ModelPro.productModel.find().populate("category")
        dataReturn.data = list;
    } catch (error) {
        dataReturn.status=404
        dataReturn.msg = error
    }
    res.json(dataReturn)
}
exports.getProduct = async(req, res, next)=>{
    let dataReturn = {
        status: 200,
        msg: "lấy  product"
    }
    let id = req.params.id
    try {
        let product = await ModelPro.productModel.find({_id:id}).populate("category")
        dataReturn.data = product;
    } catch (error) {
        dataReturn.status=404
        dataReturn.msg = error
    }
    res.json(dataReturn)
}
exports.getListProductbyCategory = async (req, res, next) => {
    let dataReturn = {
        status: 200,
        msg: "lấy list product theo thể loại"
    }
    let idCat = req.query._embed
    console.log(idCat);
    if(idCat!=''){
        try {
            let list = await ModelPro.productModel.find({category:idCat}).populate("category")
            dataReturn.data = list;
        } catch (error) {
            dataReturn.status=404
            dataReturn.msg = error
        }
    }else{
        try {
            let list = await ModelPro.productModel.find().populate("category")
            dataReturn.data = list;
        } catch (error) {
            dataReturn.status=404
            dataReturn.msg = error
        }
    }
    
    res.json(dataReturn)
}
exports.getListCategory = async (req, res, next) => {
    let dataReturn = {
        status: 200,
        msg: "lấy list Category"
    }
    try {
        let list = await ModelPro.categoryModel.find()
        dataReturn.data = list;
    } catch (error) {
        dataReturn.status=404
        dataReturn.msg = error
    }
    res.json(dataReturn)
}
exports.addProduct = async (req, res, next)=>{
    let dataReturn = {
        status: 201,
        msg: "Thêm sản phẩm thành công"
    }
    try {
        let newPro = new ModelPro.productModel();
        newPro.namePro = req.body.namePro
        newPro.price = req.body.price
        newPro.count = req.body.count
        newPro.category = req.body.category
        newPro.idUser = req.body.idKh
        newPro.nameUser = req.body.nameKh
        newPro.image = req.body.image
        await newPro.save();
    } catch (error) {
        dataReturn.status=404
        dataReturn.msg = error
    }
    res.json(dataReturn)
}
exports.putProduct = async (req, res, next)=>{
    let dataReturn = {
        status: 200,
        msg: "Cập nhật phẩm thành công"
    }
    let id = req.params.id
    let objnew = {
        namePro: req.body.namePro,
        price: req.body.price,
        count: req.body.count,
        category: req.body.category,
        idUser: req.body.idHkUpdate,
        nameUser: req.body.nameHkupdate,
        image: req.body.image
    }
    try {
       await product.productModel.updateOne({ _id: id }, objnew);


    } catch (error) {
        dataReturn.status=404
        dataReturn.msg = error
    }
    res.json(dataReturn)
}
exports.deletePro = async (req, res, next)=>{
    let dataReturn = {
        status: 200,
        msg: "Xóa sản phẩm thành công"
    }
    let id = req.params.id
    try {
       await product.productModel.deleteOne({ _id: id });
    } catch (error) {
        dataReturn.status=404
        dataReturn.msg = error
    }
    res.json(dataReturn)
}
// đơn hàng clien
exports.getListHDbyIdUserStatus = async (req, res, next) => {
    let dataReturn = {
        status: 200,
        msg: "lấy list Hóa đơn"
    }
    let id = req.params.id
    let status = req.query.status
    try {
        // lấy danh sách đơn hàng của 1 tài khoản 
        let list = await ModelHD.HoaDonModel.find({ _id: id, status: status }).sort({ date: 1 })
        dataReturn.data = list;
    } catch (error) {
        dataReturn.status=404
        dataReturn.msg = error
    }
    res.json(dataReturn)
}

exports.addDonHang = async (req, res, next) => {
    let dataReturn = {
        status: 201,
        msg: "Thêm đơn hàng thành công "
    }
    console.log(req.body);
    if(req.body.idUser!=null&&req.body.idPro!=null&&req.body.count>=0&&req.body.address!=null){
        try {
            // thêm đơn hàng 
            let newDH = new ModelHD.HoaDonModel();
            newDH.idUser = req.body.idUser;
            newDH.idpro = req.body.idPro;
            let datenow = new Date()
            console.log(datenow.getDate());
            newDH.dateOrder = datenow.getDate();
            newDH.status = false;
            newDH.count = req.body.count;
            newDH.address = req.body.address
            newDH.totalPrice = req.body.totalPrice
            await newDH.save();
        } catch (error) {
            dataReturn.status = 404
            dataReturn.msg = error
        }
    }else{
        dataReturn.status=400
        dataReturn.msg = "Đối tượng vẫn còn trường để trống"
    }
   
    res.json(dataReturn)
}
exports.putDonHang = async (req, res, next) => {
    let dataReturn = {
        status: 200,
        msg: "Xác nhận đơn hàng thành công "
    }
    console.log(req.body);
    let idDH = req.params.id;
    let DH = await ModelHD.HoaDonModel.find({ _id: idDH })
    try {
        // xác nhận đơn hàng 
        let datenow = new Date()
        console.log(datenow.getDate());
        let newDH = {
            idUser: DH.idUser,
            idpro: DH.idpro,
            dateOrder: DH.dateOrder,
            dateGet: datenow.getDate(),
            status: req.body.status,
            count: DH.count,
            address:DH.address,
            totalPrice:DH.totalPrice
        }
        await ModelHD.HoaDonModel.updateOne({_id:idDH}, newDH);
    } catch (error) {
        dataReturn.status = 404
        dataReturn.msg = error
    }
    res.json(dataReturn)
}
exports.destroyDonHang = async (req, res, next) => {
    let dataReturn = {
        status: 200,
        msg: "Hủy đơn hàng thành công "
    }
    console.log(req.body);
    let idDH = req.params.id;
    try {
        // xác nhận đơn hàng 
        await ModelHD.HoaDonModel.deleteOne({_id:idDH});
    } catch (error) {
        dataReturn.status = 404
        dataReturn.msg = error
    }
    res.json(dataReturn)
}


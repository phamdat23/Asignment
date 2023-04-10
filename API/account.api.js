const Account = require('../models/Account.models')
const bcrypt = require('bcrypt')
exports.login = async (req, res, next) => {
    try {
        const user = await Account.AccountModel.findByCredentials(req.body.username, req.body.passwd)
        if (!user) {
            return res.status(401)
                    .json({error: 'Sai thông tin đăng nhập'})
        }
        // đăng nhập thành công, tạo token làm việc mới
       // const token = await user.generateAuthToken()
 
        return res.status(200).json({ user })
 

    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}
exports.signUp = async (req, res, next) => {
    let dataReq = {
        status: 201,
        msg: "Đăng ký thành công"
    }
    let role = await Account.RoleModel.findOne({name:"Client"})
    var rexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (req.body.username != null && req.body.passwd != null && req.body.passwd.length >= 8 && req.body.fullname != null && req.body.email != null && rexEmail.test(req.body.email) == true) {
        try {
            const salt = await bcrypt.genSalt(15);
    
            const user = new Account.AccountModel(req.body);
    
            user.passwd = await bcrypt.hash(req.body.passwd, salt);
            const token = await user.generateAuthToken();
     
            user.role = role._id
            user.token = token
            let new_u = await user.save()
            dataReq.data = new_u
    
            return res.status(201).json(dataReq)
     
     
        } catch (error) {
            console.log(error)
            dataReq.msg =error.message
            return res.status(400).json(dataReq)
        }

    } else {
        dataReq.msg = "Hãy nhập vào những trường còn trống"
        dataReq.status = 400
    }

    res.json(dataReq)
}
exports.updateAccount = async (req, res, next) => {
    let dataReq = {
        status: 200,
        msg: "Cập nhật thành công"
    }
    let idA = req.params.id;
    let acc = await Account.AccountModel.findById(idA).populate("role")
    var rexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (req.body.username != null && req.body.passwd != null && req.body.passwd.length < 8 && req.body.fullname != null && req.body.email != null && rexEmail.test(req.body.email) == true) {
        try {
            const key = await bcrypt.genSalt(15)
            let hashPass = await bcrypt.hash(req.body.passwd, key)
            let newacc = {};
            newacc.username = req.body.username
            newacc.passwd = hashPass;
            newacc.fullname = req.body.fullname;
            newacc.email = req.body.email
            newacc.role = acc.role._id
            if (req.body.image == null) {
                newacc.image = acc.image
            } else {
                newacc.image = req.body.image
            }
        } catch (error) {
            dataReq.msg = error
        }


    } else {
        dataReq.msg = "Hãy nhập vào những trường còn trống"
        dataReq.status = 400
    }


    res.json(dataReq)
}
exports.checkUserame = async (req, res, next)=>{
    let dataReq = {
        status: 200,
        msg: "Tìm thấy tài khoản"
    }
    let username = req.query.username
    try {
        let user = await Account.AccountModel.find({username:username},{username:1})
        dataReq.data= user;
    } catch (error) {
        dataReq.msg = error
        dataReq.status=404
    }
    res.json(dataReq)
}
exports.getAccount= async (req, res, next)=>{
    let dataReq = {
        status: 200,
        msg: "Tìm thấy tài khoản"
    }
    let id = req.params.id
    try {
        let user = await Account.AccountModel.find({_id:id})
        dataReq.data= user;
    } catch (error) {
        dataReq.msg = error
        dataReq.status=404
    }
    res.json(dataReq)
}
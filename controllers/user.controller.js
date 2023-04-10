const { log } = require("console");
const Account = require("../models/Account.models")
const bcrypt = require('bcrypt')
const fs = require('fs').promises
exports.listUser = async (req, res, next) => {
    let acc = req.session.checkLogin;
    let page = req.query.page || 1;
    let perPage = 25
    let role = await Account.RoleModel.find();

    try {
        let listUser = await Account.AccountModel.find({ username: { $not: { $eq: acc.username } } }).populate("role")
            .skip(perPage * page - perPage).limit(perPage)
        let count = await Account.AccountModel.countDocuments();
        res.render('user/users', { users: listUser, title: "Users", current: page, pages: Math.ceil(count / perPage), roles: role })
    } catch (error) {
        console.log(error);
    }

}
exports.countUser = async (req, res, next) => {
    try {
        let listUser = await Account.AccountModel.find();
        res.render('home/home', { countUser: listUser.length, title: "Users" })
    } catch (error) {
        console.log(error);
    }

}
exports.add = async (req, res, next) => {
    let username = req.body.username;
    let pass = req.body.passwd;
    let email = req.body.email;
    let fullname = req.body.fullname;
    let objErr = {
        erFullname: "",
        erUsername: "",
        erEmail: "",
        erPasswd: ""
    }

    let chkUse = await Account.AccountModel.findOne({ username: username }, { username: 1 });
    if (fullname != "" && username != "" && email != "" && pass != "" && typeof (chkUse) != "null" && pass.length >= 8) {
        try {
            await fs.rename(req.file.path, "./public/uploads/" + req.file.originalname);
            let url = "/uploads/" + req.file.originalname;
            const key = await bcrypt.genSalt(15)
            let hashPass = await bcrypt.hash(pass, key)
            let role = await Account.RoleModel.findOne({ name: "User" });
            if (req.file.path != null) {
                let obj = new Account.AccountModel({
                    username: username,
                    passwd: hashPass,
                    fullname: fullname,
                    email: email,
                    image: url,
                    role: role._id
                })
                let new_acc = await obj.save();
                console.log(new_acc);
                let listUser = await Account.AccountModel.find();
                return res.render('user/users', { users: listUser, title: "Users", })
            } else {
                const key = await bcrypt.genSalt(15)
                let hashPass = await bcrypt.hash(pass, key)
                let obj = new Account.AccountModel({
                    username: username,
                    passwd: hashPass,
                    fullname: fullname,
                    email: email,
                    image: "",
                    role: role
                })
                let new_acc = await obj.save();
                console.log(new_acc);
                let listUser = await Account.AccountModel.find();
                return res.render('user/users', { users: listUser, title: "Users", })
            }

        } catch (error) {
            console.log(error);
        }

    } else {
        let obj = {
            fullname: fullname,
            username: username,
            email: email,
            passwd: pass,
        }
        if (fullname == "") {
            objErr.erFullname = "không được để trống mục này"
        } else {
            objErr.erFullname = ""
        }
        if (username == "") {
            objErr.erUsername = "Tên tài khỏa không được để trống"
        } else if (chkUse == null) {
            console.log(chkUse);
            objErr.erUsername = "Username đã tồn tại"
        } else {
            objErr.erUsername = ""
        }
        if (email == "") {
            objErr.erEmail = "Email không được để trống"
        } else {
            objErr.erEmail = ""
        }
        if (pass == "") {
            objErr.erPasswd = "Mật khẩu không được để trống"
        } else if (pass.length < 8) {
            objErr.erPasswd = "Mật khẩu phải từ 8 ký tự trở lên"
        }
        else {
            objErr.erPasswd = ""
        }
        let listUser = await Account.AccountModel.find();
        res.render('user/users', { objErr: objErr, acc: obj, title: "Users", users: listUser })
        return;
    }

}
exports.put = async (req, res, next) => {
    let id = req.params.id;
    let User = await Account.AccountModel.findById(id).populate('role');
    console.log(User);
    let role = await Account.RoleModel.find();
    if (req.method == "POST") {

        if (req.file != null) {
            await fs.rename(req.file.path, "./public/uploads/" + req.file.originalname);
            let url = "/uploads/" + req.file.originalname;
            const key = await bcrypt.genSalt(15)
            let hashPass = await bcrypt.hash(req.body.passwd, key)
            let obj = {
                username: req.body.username,
                passwd: hashPass,
                fullname: req.body.fullname,
                email: req.body.email,
                image: url,
                role: req.body.role
            }
            try {
                await Account.AccountModel.updateOne({ _id: id }, obj);
                res.redirect("/users");
                return;
            } catch (error) {
                console.log(error);
            }
        } else {
            const key = await bcrypt.genSalt(15)
            let hashPass = await bcrypt.hash(req.body.passwd, key)
            let obj = {
                username: req.body.username,
                passwd: hashPass,
                fullname: req.body.fullname,
                email: req.body.email,
                image: User.image,
                role: req.body.role
            }
            try {
                await Account.AccountModel.updateOne({ _id: id }, obj);
                res.redirect("/users");
                return;
            } catch (error) {
                console.log(error);
            }
        }

    }
    res.render('user/edit', { users: User, title: "Users", roles: role })
}
exports.delete = async (req, res, next) => {

    try {
        await Account.AccountModel.deleteOne({ _id: req.params.id })
        res.redirect("back")
    } catch (error) {
        console.log(error);
    }
}
exports.detail = async (req, res, next) => {
    try {
        let user = await Account.AccountModel.findById(req.params.id)
        res.render('user/detail', { user: user })
    } catch (error) {
        console.log("lỗi: " + error);
    }
}
exports.filte = async (req, res, next) => {
    let query = {}
    let acc = req.session.checkLogin;
    let user = req.query.search_username;
    let role = await Account.RoleModel.find();
    let page = req.query.page || 1;
    let perPage = 25
    if (req.query.search_username != '') {
        if (req.query.role_search != 0) {
            try {
                let listUser = await Account.AccountModel.find({ $and: [{username:{ $regex: req.query.search_username, $options: 'i' }}, {username:{ $not: { $eq: acc.username } }}] , role: req.query.role_search }).populate("role")
                    .skip(perPage * page - perPage).limit(perPage)
                let count = await Account.AccountModel.countDocuments();
              return  res.render('user/users', { users: listUser, title: "Users", current: page, pages: Math.ceil(count / perPage), roles: role })
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                let listUser = await Account.AccountModel.find({ $and: [{username:{ $regex: req.query.search_username, $options: 'i' }}, {username:{ $not: { $eq: acc.username } }}]}).populate("role")
                    .skip(perPage * page - perPage).limit(perPage)
                let count = await Account.AccountModel.countDocuments();
              return  res.render('user/users', { users: listUser, title: "Users", current: page, pages: Math.ceil(count / perPage), roles: role })
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        query.username = { $not: { $eq: acc.username } }
        if (req.query.role_search != 0) {
            query.role = req.query.role_search
        }
    }
    console.log(query);

    try {
        let listUser = await Account.AccountModel.find(query).populate("role")
            .skip(perPage * page - perPage).limit(perPage)
        let count = await Account.AccountModel.countDocuments();
        res.render('user/users', { users: listUser, title: "Users", current: page, pages: Math.ceil(count / perPage), roles: role })
    } catch (error) {
        console.log(error);
    }
}
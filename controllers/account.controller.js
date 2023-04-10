const { log } = require('console');
const account = require('../models/Account.models')
const fs = require('fs').promises;
const bcrypt = require('bcrypt')
exports.signupLayout = (req, res, next) => {
    let erFullname = ""
    let erUsername = ""
    let erEmail = ""
    let erPasswd = ""
    let erRePass = ""
    let obj = {
        fullname: "",
        username: "",
        email: "",
        password: "",
        repass: ""
    }
    res.render('SignUp', { erFullname: erFullname, erEmail: erEmail, erUsername: erUsername, erPasswd: erPasswd, erRePass: erRePass, acc: obj })
}
exports.signup = async (req, res, next) => {
    let fullname = req.body.fullname;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.passwd;
    let image = req.body.avata;
    let repass = req.body.repasswd
    let role = "Admin"
    let erFullname = ""
    let erUsername = ""
    let erEmail = ""
    let erPasswd = ""
    let erRePass = ""
    var rexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    let chkUse = await account.AccountModel.findOne({ username: username }, { username: 1 });

    if (fullname != "" && username != "" && email != "" && password != "" && repass != "" && password == repass && chkUse == null && password.length >= 8 && rexEmail.test(email) == true) {

        try {

            let objAcc = new account.AccountModel()
            objAcc.username = username;
           
            objAcc.fullname = fullname;
            objAcc.email = email;
            if(req.file!=null){
                await fs.rename(req.file.path, "./public/uploads/" + req.file.originalname);
                objAcc.image = "/uploads/" + req.file.originalname;
            }else{
                
                objAcc.image = "";
            }
           

            objAcc.role = role;
            const key = await bcrypt.genSalt(15)
            let hashPass = await bcrypt.hash(password, key)
            objAcc.passwd = hashPass;
            let new_acc = await objAcc.save();

            console.log(new_acc);
            res.redirect('/login')
            return;
        } catch (error) {
            console.log(error);
        }
    } else {

        let obj = {
            fullname: fullname,
            username: username,
            email: email,
            password: password,
            repass: repass
        }

        if (fullname == "") {
            erFullname = "không được để trống mục này"
        } else {
            erFullname = ""
        }
        if (username == "") {
            erUsername = "Tên tài khỏa không được để trống"
        } else if (chkUse != null) {
            console.log(chkUse);
            erUsername = "Username đã tồn tại"
        } else {
            erUsername = ""
        }
        if (email == "") {
            erEmail = "Email không được để trống"
        } else if (rexEmail.test(email) == false) {
            erEmail = "Email không hợp lệ"
        }
        else {
            erEmail = ""
        }
        if (password == "") {
            erPasswd = "Mật khẩu không được để trống"
        } else if (password.length < 8) {
            erPasswd = "Mật khẩu ít nhất 8 ký tự"
        } else {
            erPasswd = ""
        }
        if (repass == "") {
            erRePass = "Mục này không được để trống"
        } else if (repass != password) {
            erRePass = "Mật khẩu không đúng"
        } else {
            erRePass = ""
        }
        res.render('SignUp', { erFullname: erFullname, erEmail: erEmail, erUsername: erUsername, erPasswd: erPasswd, erRePass: erRePass, acc: obj })
        return;
    }

}
exports.signinLayout = (req, res, next) => {
    let username = req.body.username;
    let pass = req.body.passwd;
    res.render('Signin', { err: " ", us: "" })
}
exports.login = async (req, res, next) => {
    console.log("login");
    let username = req.body.username;
    let pass = req.body.passwd;
    let acc = await account.AccountModel.findOne({ username: username }).populate("role")
    if (acc != null) {
        let checkPass = await bcrypt.compare(pass, acc.passwd);
        if (checkPass == true) {
            console.log(acc);
            console.log("role: " + acc.role);
            req.session.checkLogin = acc;
            res.redirect("/")
        } else {
            return res.render('Signin', { err: "Mật khẩu không đúng", us: username })
        }

    } else {
        return res.render('Signin', { err: "Tài khoản không tông tại", us: username })
    }


}
exports.updateAccount = async (req, res, next) => {
    let id = req.params.id;
    let acc = await account.AccountModel.findOne({ _id: id });
    console.log(acc);
    if (req.method == 'POST') {
        let url = "";
        if (req.file.path != null) {
            await fs.rename(req.file.path, "./public/uploads/" + req.file.originalname);
            url = "/uploads/" + req.file.originalname;
            const key = await bcrypt.genSalt(15)
            let hashPass = await bcrypt.hash(req.body.passwd, key)
            let obj = {
                username: req.body.username,
                passwd: hashPass,
                fullname: req.body.fullname,
                email: req.body.email,
                image: req.body.image,
                role: acc.role
            }
            try {
                await account.AccountModel.updateOne({ _id: id }, obj)
                // res.redirect('/setting')
                let accnew = await account.AccountModel.findOne({ _id: id });
                return res.render('settings/updateAccount', { users: accnew })
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
                image: acc.image,
                role: acc.role
            }
            try {
                await account.AccountModel.updateOne({ _id: id }, obj)
                // res.redirect('/setting')
                let accnew = await account.AccountModel.findOne({ _id: id });
                return res.render('settings/updateAccount', { users: accnew })
            } catch (error) {
                console.log(error);
            }
        }


    }
    res.render('settings/updateAccount', { users: acc })
}
exports.setting = async (req, res, next) => {
    try {
        let acc = req.session.checkLogin;
        console.log(acc.email);
        res.render('settings/setting', { account: acc,email:acc.email })
    } catch (error) {
        console.log(error);
    }
}
exports.logout = async (req, res, next) => {
    if (req.session != null) {
        req.session.destroy(function () {
            console.log("Đăng xuất thành công")
            res.redirect('/login');
        })
    }

}

const roleModel = require('../models/Account.models')
exports.requessLogin = async (req, res, next) => {
    var roleAdmin = await roleModel.RoleModel.findOne({name:"Admin"})
    var roleUser = await roleModel.RoleModel.findOne({name:"User"})
    console.log(roleAdmin);
    console.log(roleUser);

    if (req.session.checkLogin) {
        console.log(req.session.checkLogin.role._id);
        console.log(roleAdmin._id);
        if(req.session.checkLogin.role.name==roleAdmin.name||req.session.checkLogin.role.name==roleUser.name){
            next()
        }else{
            return res.send("<h1>Tài khoản không đủ quyền hạn để truy cập</h1>")
        }

    } else {
        console.log("vào login");
        res.redirect("/login")
    }
}
exports.requessLoginRole = async (req, res, next) => {
    console.log(req.session.checkLogin);
    var roleAdmin = await roleModel.RoleModel.findOne({name:"Admin"})
    if (req.session.checkLogin) {
        if (req.session.checkLogin.role._id == roleAdmin._id) {
            console.log( roleAdmin);
            console.log("vào home");
            next();
            return;

        } else {
            return res.send("<h1>Tài khoản không đủ quyền hạn để truy cập</h1>")
                
        }
    } else {
        console.log("vào login");
        res.redirect("/login")
    }
}
exports.NotRequessLogin = (req, res, next) => {
    if (!req.session.checkLogin) {
        next()
        return;
    } else {
        return res.redirect('/')
    }
}
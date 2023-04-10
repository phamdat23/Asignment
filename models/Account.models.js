const myDb = require('./db')
const jwt = require('jsonwebtoken')  ;
require('dotenv').config(); 
const chuoi_ky_tu_bi_mat = process.env.TOKEN_SEC_KEY;
const bcrypt = require("bcrypt");
const AccountSchema = new myDb.mongoose.Schema({
    username:{type:String, required:true},
    passwd:{type:String, required:true},
    fullname:{type:String, required:true},
    email:{type:String, required:true},
    image:{type:String, required:false},
    role:{type:myDb.mongoose.Types.ObjectId,required:true, ref:"RoleModel" }, 
    token:{type:String, required:false}
},{
    collection:"Accounts"
})
// tạo token cho đăng ký 
AccountSchema.methods.generateAuthToken = async ()=>{
    const user = this
    console.log(user)
    const token = jwt.sign({ _id: user._id, username: user.username}, chuoi_ky_tu_bi_mat)
    // user.tokens = user.tokens.concat({token}) // code này dành cho nhiều token, ở demo này dùng 1 token
    // user.token = token;
    // await user.save()
    return token
}

AccountSchema.statics.findByCredentials = async (username, passwd) => {
    const role = await RoleModel.findOne({name:"Client"})
    const user = await AccountModel.findOne({ username:username }).populate('role')
    if (!user) {
        throw new Error({ error: 'Không tồn tại user' })
    }
    const isPasswordMatch = await bcrypt.compare(passwd, user.passwd)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Sai password' })
    }
    return user
}


const RoleSchema = new myDb.mongoose.Schema({
    name:{type:String, required:true}
}, {
    collection:"Roles"
})
const AccountModel = myDb.mongoose.model("AccountModel", AccountSchema);
const RoleModel = myDb.mongoose.model("RoleModel", RoleSchema)
module.exports ={AccountModel, RoleModel}
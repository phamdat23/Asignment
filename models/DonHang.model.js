const mydb = require('./db')
const HDSchema = new mydb.mongoose.Schema({
    idUser:{type: mydb.mongoose.Types.ObjectId, ref:"AccountModel", required:true},
    idpro:{type:mydb.mongoose.Types.ObjectId, ref:"productModel", required:true},
    dateOrder:{type:Date, required:true},
    dateGet:{type:Date, required:false},
    status:{type:Boolean, required:true},
    count:{type:Number, required:true, default:0},
    address:{type:String, required:true},
    totalPrice:{type:Number, required:false, default:0}
    
},{
    collection:"HoaDon"
})
const HoaDonModel = mydb.mongoose.model("HoaDonModel", HDSchema)
module.exports ={HoaDonModel}


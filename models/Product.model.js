const mydb = require("./db")
const productSchema = new mydb.mongoose.Schema({
    namePro:{type:String,required:true},
    price:{type:Number,default:0,required:true},
    count:{type:Number,default:0,required:true},
    category:{type:mydb.mongoose.Types.ObjectId,ref:"categoryModel",required:true},
    idUser:{type:String,required:true},
    nameUser:{type:String,required:true},
    image:{type:String,required:true }
},{
    collection:"Products"
})
const categoryShema = new mydb.mongoose.Schema({
    name:{type:String,required:true}
},{
    collection:"Categorys"
})
const productModel = mydb.mongoose.model("productModel",productSchema)
const categoryModel = mydb.mongoose.model("categoryModel", categoryShema)
module.exports ={productModel, categoryModel}
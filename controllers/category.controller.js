const product = require('../models/Product.model')
exports.getListCategory = async (req, res, next) => {
    let page = req.query.page ||1;
    let perPage = 25
    let category = await product.categoryModel.find()
    .skip(perPage*page-perPage).limit(perPage)
    let count = await product.categoryModel.countDocuments();
    res.render('categorys/category', { categorys: category, current:page, pages:Math.ceil(count/perPage) })
}
exports.addCategory = async (req, res, next)=>{
    if(req.method=="POST"){
        let obj = new product.categoryModel();
        console.log(req.body.nameCategory);
        if(req.body.nameCategory!=null){
            obj.name = req.body.nameCategory
            console.log(obj);
            await obj.save();
            return res.redirect('/category')
        }
    }
   
}
exports.putCategory = async (req, res, next)=>{
    let obj = await product.categoryModel.findOne({_id:req.params.id});
    if(req.method=="POST"){
        if(req.body.nameCategory!=null){
            let newCat ={
                name:req.body.nameCategory
            }
            await product.categoryModel.updateOne({_id:req.params.id},newCat);
            return res.redirect('/category')
        }else{
            let newCat ={
                name:obj.name
            }
            await product.categoryModel.updateOne({_id:req.params.id},newCat);
            return res.redirect('/category')
        }
    }
    res.render('categorys/edit',{category:obj})
    
}
exports.filte = async(req, res, next)=>{
    if(req.query.search_category!=""){
        let page = req.query.page ||1;
        let perPage = 25
        let category = await product.categoryModel.find({name:{ $regex: req.query.search_category, $options: 'i' }})
        .skip(perPage*page-perPage).limit(perPage)
        let count = await product.categoryModel.countDocuments();
        res.render('categorys/category', { categorys: category, current:page, pages:Math.ceil(count/perPage) })
    }else{
        let page = req.query.page ||1;
        let perPage = 25
        let category = await product.categoryModel.find()
        .skip(perPage*page-perPage).limit(perPage)
        let count = await product.categoryModel.countDocuments();
        res.render('categorys/category', { categorys: category, current:page, pages:Math.ceil(count/perPage) })
    }
}
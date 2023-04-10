const { log } = require('console');
const product = require('../models/Product.model')
const fs = require('fs').promises;
exports.getListProduct = async (req, res, next) => {
    let products = await product.productModel.find().populate("category").limit(20);
    let categorts = await product.categoryModel.find();
    res.render('home/home', { products: products, countProduct: products.length, categorys: categorts, title: "Products" })
}
exports.getListProduct2 = async (req, res, next) => {
    let page = req.query.page ||1;
    let perPage = 25
    let products = await product.productModel.find()
    .populate("category")
    .skip(perPage*page-perPage).limit(perPage)
    let count = await product.productModel.countDocuments();
    let categorts = await product.categoryModel.find();
    res.render('product/products', { products: products, current:page, pages:Math.ceil(count/perPage), categorys: categorts, title: "Products" })
}
exports.addProduct = async (req, res, next) => {
    // if(req.method=="post"){
    let obj = new product.productModel()
    obj.namePro = req.body.nameProductAdd
    obj.price = req.body.priceProductAdd
    obj.count = req.body.countProductAdd
    obj.category = req.body.category
    obj.idUser = req.body.idKh
    obj.nameUser = req.body.nameKh
    if (obj.namePro != "null" && obj.price != "null" && obj.count != "null" && obj.category != "null") {
        try {
            if (req.file != null) {
                await fs.rename(req.file.path, "./public/uploads/" + req.file.originalname);
                let url = "http://localhost:3000/uploads/" + req.file.originalname;
                    obj.namePro = req.body.nameProductAdd
                    obj.price = req.body.priceProductAdd
                    obj.count = req.body.countProductAdd
                    obj.category = req.body.category
                    obj.idUser = req.body.idKh
                    obj.nameUser = req.body.nameKh
                    obj.image = url
                    let new_user = await obj.save();
                    return res.redirect('/product')
            } else {
                let obj = new product.productModel({
                    namePro: req.body.nameProductAdd,
                    price: req.body.priceProductAdd,
                    count: req.body.countProductAdd,
                    category: req.body.category,
                    idUser: req.body.idKh,
                    nameUser: req.body.nameKh,
                    image: "",
                })
                let new_user = await obj.save();
                return res.redirect('/product')
            }

        } catch (error) {
            console.log(error);
        }

    }else{
        
    }
    // }
}
exports.put = async (req, res, next) => {
    let url = "";
    let id = req.params.id
    let products = await product.productModel.findOne({ _id: id });
    let categorts = await product.categoryModel.find();
    if (req.method == "POST") {
        if (req.file != null) {
            await fs.rename(req.file.path, "./public/uploads/" + req.file.originalname);
            url = "http://localhost:3000/uploads/" + req.file.originalname;
            let objnew = {
                namePro: req.body.nameProductUpdate,
                price: req.body.priceProductUpdate,
                count: req.body.countProductUpdate,
                category: req.body.category,
                idUser: req.body.idHkUpdate,
                nameUser: req.body.nameHkupdate,
                image: url
            }
            try {
                const update = await product.productModel.updateOne({ _id: id }, objnew);
                console.log(update);
                res.redirect("http://localhost:3000/product");
                return;

            } catch (error) {
                console.log(error);
            }
        } else {
            let objnew = {
                namePro: req.body.nameProductUpdate,
                price: req.body.priceProductUpdate,
                count: req.body.countProductUpdate,
                category: req.body.category,
                idUser: req.body.idHkUpdate,
                nameUser: req.body.nameHkupdate,
                image: product.image
            }
            try {
                const update = await product.productModel.updateOne({ _id: id }, objnew);
                console.log(update);
                res.redirect("http://localhost:3000/product");
                return;

            } catch (error) {
                console.log(error);
            }
        }



    }
    res.render('product/edit', { itemOld: products, categorys: categorts })

}
exports.delete = async (req, res, next) => {
    try {
        let id = req.params.id
        console.log(id);
        await product.productModel.deleteOne({ _id: id });
        res.redirect('back')

    } catch (error) {
        console.log(error);

    }

}
exports.detail = async (req, res, next) => {
    try {
        let obj = await product.productModel.findById(req.params.id).populate("category")
        res.render("product/detail", { product: obj })
    } catch (error) {
        console.log(error);
    }
}
exports.filte = async (req, res, next) => {
 

    let category = req.query.category_search;
    let price = req.query.price_search;
    let queryPrice;
    let page = req.query.page ||1;
    let perPage = 10
    if (price == 1) {
        queryPrice = { $lt: 100 }
    } else if (price == 2) {
        queryPrice = { $gte: 100, $lte: 400 }
    } else if (price == 3) {
        queryPrice = { $gt: 400 }
    } else {
        queryPrice = { $gt: 0 }
    }
    try {
        
        if(req.query.search_name==null){
            if (category == 0) {
                let products = await product.productModel.find({ price: queryPrice }).populate("category") .skip(perPage*page-perPage).limit(perPage);
                let categorts = await product.categoryModel.find();
                let count = await product.productModel.countDocuments();
                return res.render('product/products', { products: products,current:page, pages:Math.ceil(count/perPage), countProduct: products.length, categorys: categorts, title: "Products" })
    
            } else {
                let products = await product.productModel.find({ category: category, price: queryPrice }).populate("category") .skip(perPage*page-perPage).limit(perPage);
                let categorts = await product.categoryModel.find();
                let count = await product.productModel.countDocuments();
                return res.render('product/products', { products: products,current:page, pages:Math.ceil(count/perPage), countProduct: products.length, categorys: categorts, title: "Products" })
            }
        }
        else{
            if (category == 0) {
                let products = await product.productModel.find({namePro:{ $regex: req.query.search_name, $options: 'i' }, price: queryPrice }).populate("category") .skip(perPage*page-perPage).limit(perPage);
                let categorts = await product.categoryModel.find();
                let count = await product.productModel.countDocuments();
                return res.render('product/products', { products: products,current:page, pages:Math.ceil(count/perPage), countProduct: products.length, categorys: categorts, title: "Products" })
    
            } else {
                let products = await product.productModel.find({namePro:{ $regex: req.query.search_name, $options: 'i' }, category: category, price: queryPrice }).populate("category") .skip(perPage*page-perPage).limit(perPage);
                let categorts = await product.categoryModel.find();
                let count = await product.productModel.countDocuments();
                return res.render('product/products', { products: products,current:page, pages:Math.ceil(count/perPage), countProduct: products.length, categorys: categorts, title: "Products" })
            }
        }
       
    } catch (error) {
        console.log(error);
    }


    // let products = await product.productModel.find().populate("category");


}
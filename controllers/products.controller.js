const productModel = require('../models/Product');

// 성공한 케이스에 대한 코드
// exports.createProduct = async(req, res, next) => {
//     const newProduct = await productModel.create(req.body);
//     console.log('createProduct', newProduct);
//     res.status(201).json(newProduct);
// };

// 비동기 요청에 대한 에러 발생에 대한 예외처리
exports.createProduct = async(req, res, next) => {
    try {
        const newProduct = await productModel.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async(req, res, next) => {
    try {
        const allProducts = await productModel.find({});
        res.status(200).json(allProducts);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async(req, res, next) => {
    console.log('params.productId', req.params.productId);
    await productModel.findById(req.params.productId);
};
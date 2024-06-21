import { request, response } from "express";
import { productModel } from "../dao/mongoDB/models/product.model.js";


export const checkProductData = async (req = request, res = response, next) => {

    try {
        let { title, description, price, code, stock, category } = req.body;

        price = parseFloat(price);
        code = parseInt(code, 10);
        stock = parseInt(stock, 10);

        const newProduct = {
            title,
            description,
            price,
            code,
            stock,
            category,
        };
        
        const products = await productModel.find();

        const checkData = Object.values(newProduct).includes(undefined || "");
        if (checkData ) return res.status(400).json({ status: "Error", msg: "Todos los datos son obligatorios" });

        const productExists = products.find((p) => p.code === code);
        if (productExists) return res.status(400).json({ status: "Error", msg: `El producto con el código ${code} ya existe` });



        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
    }
};
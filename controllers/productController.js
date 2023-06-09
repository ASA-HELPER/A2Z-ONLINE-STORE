import productModel from "../models/productModel.js";
import categoryModel from '../models/categoryModel.js'
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import { request } from "http";
import dotenv from 'dotenv'

dotenv.config();

// Payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, resp) => {
    try {
        // used formidable so we have to get data from fields rather than body
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //Validation
        switch (true) {
            case !name:
                return resp.status(500).send({ error: "Name is Required" });
            case !description:
                return resp.status(500).send({ error: "Description is Required" });
            case !price:
                return resp.status(500).send({ error: "Price is Required" });
            case !category:
                return resp.status(500).send({ error: "Category is Required" });
            case !quantity:
                return resp.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return resp
                    .status(500)
                    .send({ error: "Photo is Required and should be less then 1mb" });
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        resp.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            error,
            message: "Error in crearing product",
        });
    }
};

//get all products
export const getProductController = async (req, resp) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        resp.status(200).send({
            success: true,
            countTotal: products.length,
            message: "AllProducts ",
            products,
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: "Erorr in getting products",
            error: error.message,
        });
    }
};
// get single product
export const getSingleProductController = async (req, resp) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");
        resp.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product,
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: "Eror while getitng single product",
            error,
        });
    }
};

// get photo
export const productPhotoController = async (req, resp) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            resp.set("Content-type", product.photo.contentType);
            return resp.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: "Erorr while getting photo",
            error,
        });
    }
};

//delete controller
export const deleteProductController = async (req, resp) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        resp.status(200).send({
            success: true,
            message: "Product Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
};

//update products
export const updateProductController = async (req, resp) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return resp.status(500).send({ error: "Name is Required" });
            case !description:
                return resp.status(500).send({ error: "Description is Required" });
            case !price:
                return resp.status(500).send({ error: "Price is Required" });
            case !category:
                return resp.status(500).send({ error: "Category is Required" });
            case !quantity:
                return resp.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return resp
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        resp.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};

// filters
export const productFiltersController = async (req, resp) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        resp.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        resp.status(400).send({
            success: false,
            message: "Error While Filtering Products",
            error,
        });
    }
};

// product count
export const productCountController = async (req, resp) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        resp.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        resp.status(400).send({
            message: "Error in product count",
            error,
            success: false,
        });
    }
};

// product list base on page
export const productListController = async (req, resp) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        resp.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        resp.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
};

// search Product
export const searchProductController = async (req, resp) => {
    try {
        const { keyword } = req.params;
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo");
        resp.json(results);
    } catch (error) {
        console.log(error)
        resp.status(400).send({
            success: false,
            message: 'Error in search product API',
            error
        })
    }
}

// Similar Product
export const realtedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error while geting related product",
            error,
        });
    }
};

// get products by catgory
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error While Getting products",
        });
    }
};

// Payment gateway api : getting token
export const braintreeTokenController = async (req, resp) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                resp.status(500).send(err)
            }
            else {
                resp.send(response);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// payment
export const braintreePaymentController = async (req, resp) => {
    try {
        const { cart, nonce } = req.body
        let total = 0
        cart.map((i) => { total += i.price })
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save()
                    resp.json({ ok: true })
                }
                else {
                    resp.status(500).send(error)
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}
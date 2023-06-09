import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async (req, resp) => {
    try {
        const { name } = req.body;
        if (!name) {
            return resp.status(401).send({ message: "Name is required" });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return resp.status(200).send({
                success: false,
                message: "Category Already Exists",
            });
        }
        const category = await new categoryModel({
            name,
            slug: slugify(name),
        }).save();
        resp.status(201).send({
            success: true,
            message: "new category created",
            category,
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            error,
            message: "Errro in Category",
        });
    }
};

//update category : pass {new : true} for doing updations
export const updateCategoryController = async (req, resp) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        );
        resp.status(200).send({
            success: true,
            messsage: "Category Updated Successfully",
            category,
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            error,
            message: "Error while updating category",
        });
    }
};

// get all category
export const categoryController = async (req, resp) => {
    try {
        const category = await categoryModel.find({});
        resp.status(200).send({
            success: true,
            message: "All Categories List",
            category,
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            error,
            message: "Error while getting all categories",
        });
    }
};

// single category
export const singleCategoryController = async (req, resp) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        resp.status(200).send({
            success: true,
            message: "Get Single Category Successfully",
            category,
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            error,
            message: "Error While getting Single Category",
        });
    }
};

//delete category
export const deleteCategoryCOntroller = async (req, resp) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        resp.status(200).send({
            success: true,
            message: "Category Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: "error while deleting category",
            error,
        });
    }
};
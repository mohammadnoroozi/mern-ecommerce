import Category from "../models/category.js";
import Product from "../models/product.js";
import slugify from "slugify";

export const create = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name?.trim()) {
            return res.json({ error: "Name is required" });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.json({ error: "Already exists" });
        }

        const category = await Category.create({ name, slug: slugify(name) });

        res.json(category)
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

export const update = async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;

        const category = await Category.findByIdAndUpdate(categoryId, {
            name,
            slug: slugify(name)
        }, { new: true });
        res.json(category);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const remove = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const removed = await Category.findByIdAndDelete(categoryId);

        res.json(removed);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const list = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const read = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.json({ error: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const productsByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug });
        const products = await Product.find({ category }).populate("category");

        res.json({
            category,
            products
        })

    } catch (err) {
        console.log(err);
    }
}
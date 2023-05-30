import slugify from "slugify";
import Product from "../models/product.js";
import braintree from "braintree";
import sgMail from "@sendgrid/mail";

import fs from "fs";

import dotenv from "dotenv";
import Order from "../models/order.js";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_KEY);


const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

export const create = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name?.trim():
                return res.json({ error: "Name is required" });
            case !description?.trim():
                return res.json({ error: "Description is required" });
            case !price?.trim():
                return res.json({ error: "Price is required" });
            case !category?.trim():
                return res.json({ error: "Category is required" });
            case !quantity?.trim():
                return res.json({ error: "Quantity is required" });
            case !shipping?.trim():
                return res.json({ error: "Shipping is required" });
            case photo && photo.size > 1000000:
                return res.json({ error: "Image should be less than 1mb in size" });
            case !photo:
                return res.json({ error: "Photo is required" });
        }

        const product = new Product({ ...req.fields, slug: slugify(name) });

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();

        return res.json(product);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}


export const update = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name?.trim():
                return res.json({ error: "Name is required" });
            case !description?.trim():
                return res.json({ error: "Description is required" });
            case !price?.trim():
                return res.json({ error: "Price is required" });
            case !category?.trim():
                return res.json({ error: "Category is required" });
            case !quantity?.trim():
                return res.json({ error: "Quantity is required" });
            case !shipping?.trim():
                return res.json({ error: "Shipping is required" });
            case photo && photo.size > 1000000:
                return res.json({ error: "Image should be less than 1mb in size" });
        }

        const product = await Product.findByIdAndUpdate(productId, {
            ...req.fields,
            slug: slugify(name)
        }, { new: true });

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();

        return res.json(product);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}

export const list = async (req, res) => {
    try {
        const products = await Product.find().populate("category").select("-photo").sort({ createdAt: -1 });
        return res.json(products)
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}

export const read = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug }).select("-photo").populate("category");
        if (!product) {
            return res.json({ error: "Product not found" });
        }
        return res.json(product)
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}

export const remove = async (req, res) => {
    try {
        const { productId } = req.params;
        const removed = await Product.findByIdAndDelete(productId).select("-photo");
        return res.json(removed);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}

export const photo = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).select("photo");
        if (product.photo.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.send(product.photo.data)
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}


export const filteredProducts = async (req, res) => {
    try {
        const { checked, radio } = req.body;

        let args = {};

        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        console.log(args);

        const products = await Product.find(args);

        res.json(products);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const productsCount = async (req, res) => {
    try {
        const total = await Product.find().estimatedDocumentCount();
        res.json(total);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const listProducts = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page || 1;

        const products = await Product.find().select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.json(products);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const productsSearch = async (req, res) => {
    try {
        const { keyword } = req.params;
        const products = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo");

        res.json(products);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const relatedProducts = async (req, res) => {
    try {
        const { productId, categoryId } = req.params;

        const related = await Product.find({
            category: categoryId,
            _id: { $ne: productId }
        }).select("-photo").populate("category").limit(3);

        res.json(related);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const getToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            } else {
                res.send(response)
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}

export const processPayment = async (req, res) => {
    try {
        const { nonce, cart } = req.body;

        let total = 0;

        cart?.map(i => {
            total += i.price;
        })

        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        }, async function (error, result) {
            if (result) {
                // res.send(result);
                const order = await Order.create({
                    products: cart,
                    payment: result,
                    buyer: req?.user?._id
                });

                const bulkOps = cart.map(item => {
                    return {
                        updateOne: {
                            filter: { _id: item._id },
                            update: { $inc: { quantity: -0, sold: +1 } }
                        }
                    }
                })

                Product.bulkWrite(bulkOps, {})

                res.json({ ok: true })
            } else {
                res.status(500).send(error);
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message)
    }
}


export const orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).populate("buyer", "email name");

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: order.buyer.email,
            subject: "Order Status",
            html: `
                <h1>
                    Hi ${order.buyer.name}, Your order's status is: <span style="color: dodgerblue;">${order.status}</span>
                </h1>
                <p>
                    Visit <a href="${process.env.CLIENT_URL}/dashboard/user/orders">your dashboard</a> for more details
                </p>
            `
        }

        sgMail.send(emailData).then(res => {
            console.log("res>>", res);
        }).catch(err => {
            console.log("Err>>", err);
            console.log("err detail>>", err?.response?.body);
        });

        res.json(order)
    } catch (err) {
        console.log(err);
    }
}
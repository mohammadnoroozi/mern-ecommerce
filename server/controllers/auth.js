import jwt from "jsonwebtoken";
import Order from "../models/order.js";

import { comparePassword, hashPassword } from "../helpers/auth.js";
import User from "../models/user.js";


export const register = async (req, res) => {
    try {
        // 1. destructure name, email, password from req.body
        const { name, email, password } = req.body;
        // 2. all fields require validation 
        if (!name.trim()) {
            return res.json({ error: "Name is required" })
        }
        if (!email) {
            return res.json({ error: "Email is taken" })
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Password must be at least 6 charactors long" })
        }
        // 3. check if email is taken 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ error: "Email is taken" })
        }
        // 4. hash password
        const hashedPassword = await hashPassword(password);
        // 5. register user
        const user = await User.create({ name, email, password: hashedPassword });
        // 6. create signed jwt
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        // 7. send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            },
            token
        })

    } catch (err) {
        console.log(err);
    }
}


export const login = async (req, res) => {
    try {
        // 1. destructure name, email, password from req.body
        const { email, password } = req.body;
        // 2. all fields require validation 
        if (!email) {
            return res.json({ error: "Email is taken" })
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Password must be at least 6 charactors long" })
        }
        // 3. check if email is taken 
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "User not found" })
        }
        // 4. compare password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({ error: "Wrong password" })
        }
        // 5. create signed jwt
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        // 6. send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            },
            token
        })

    } catch (err) {
        console.log(err);
    }
}

export const secret = async (req, res) => {
    try {
        res.json({ currentUser: req.user })
    } catch (err) {
        console.log(err)
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, password, address } = req.body;
        const user = await User.findById(req.user?._id);
        if (password && password.length < 6) {
            return res.json({
                error: "Password is required and should be min 6 characters long"
            })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await User.findByIdAndUpdate(req.user?._id, {
            name: name || user.name,
            address: address || user.address,
            password: hashedPassword || user.password
        }, { new: true }).select("-password");

        res.json(updatedUser)

    } catch (err) {
        console.log(err);
    }
}

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req?.user?._id }).populate("products", "-photo").populate("buyer", "name").sort({createdAt: "-1"});
        res.json(orders)
    } catch (err) {
        console.log(err);
    }
}

export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("products", "-photo").populate("buyer", "name").sort({createdAt: "-1"});
        res.json(orders);
    } catch (err) {
        console.log(err);
    }
}
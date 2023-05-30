import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema({
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    payment: {},
    buyer: { type: mongoose.Types.ObjectId, ref: "User" },
    status: {
        type: String, default: "Not processed", enum: [
            "Not processed", "Processing", "Shipped", "Delivered", "Cancelled"
        ]
    },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema)
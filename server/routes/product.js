import express from "express";
import formidable from "express-formidable";

import { requireSignin, isAdmin } from "../middlewares/auth.js";

import { create, list, read, photo, remove, update, filteredProducts, productsCount, listProducts, productsSearch, relatedProducts, getToken, processPayment, orderStatus } from "../controllers/product.js"

const router = express.Router();

// create
router.post("/product", requireSignin, isAdmin, formidable(), create);

// list 
router.get("/products", list);

// get single product
router.get("/product/:slug", read);

// get product photo
router.get("/product/photo/:productId", photo);

// remove product
router.delete("/product/:productId", requireSignin, isAdmin, remove);

// update product
router.put("/product/:productId", requireSignin, isAdmin, formidable(), update);

// filter product
router.post("/filtered-products", filteredProducts);

// filter product
router.get("/products-count", productsCount);

// filter product
router.get("/list-products/:page", listProducts);

// search product
router.get("/products/search/:keyword", productsSearch);

// related product
router.get("/related-products/:productId/:categoryId", relatedProducts);

// get Token
router.get("/braintree/token", getToken);

// payment
router.post("/braintree/payment", requireSignin,processPayment);

// payment
router.put("/order-status/:orderId", requireSignin, isAdmin, orderStatus);


export default router;
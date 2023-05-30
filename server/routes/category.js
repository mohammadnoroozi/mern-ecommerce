import express from "express";

import { create, update, remove, list, read, productsByCategory } from "../controllers/category.js";

import { isAdmin, requireSignin } from "../middlewares/auth.js";

const router = express.Router();

// create
router.post("/category", requireSignin, isAdmin, create);

// update
router.put("/category/:categoryId", requireSignin, isAdmin, update);

// delete 
router.delete("/category/:categoryId", requireSignin, isAdmin, remove);

// get
router.get("/categories", list);
router.get("/category/:slug", read);

// product by category
router.get("/products-by-category/:slug", productsByCategory);

export default router;
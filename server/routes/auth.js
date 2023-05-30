import express from "express";
import { allOrders, getOrders, login, register, secret, updateProfile } from "../controllers/auth.js";

import { isAdmin, requireSignin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register)

router.post("/login", login)

router.get("/auth-check", requireSignin, (req, res) => {
    res.json({ ok: true })
})
router.get("/admin-check", requireSignin, isAdmin, (req, res) => {
    res.json({ ok: true })
})

router.put("/profile", requireSignin, updateProfile)

router.get("/orders", requireSignin, getOrders);

router.get("/all-orders", requireSignin, isAdmin, allOrders);

router.get("/secret", requireSignin, isAdmin, secret)

export default router;
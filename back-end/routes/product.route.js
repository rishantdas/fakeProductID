import express from "express";
import { addProduct } from "../controllers/product.controller.js";
const router = express.Router();
router.post("/add-product", addProduct);
export default router;

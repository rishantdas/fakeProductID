import express from "express";
import { createAccount, getAccount } from "../controllers/user.controller.js";
import {isAdminAuthenticated} from "../middlewares/auth.js"
const router = express.Router();



router.post("/createAccount",createAccount);

router.get("/:username", isAdminAuthenticated,getAccount);


export default router;
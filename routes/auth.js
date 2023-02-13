import {register,login,logout} from "../controllers/auth.js";
import express  from "express";

const router = express.Router();

router.post("/register", register);
router.post("/logout", logout);
router.post("/login", login);


export default router
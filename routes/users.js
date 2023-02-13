import express  from "express";
import { deleteUser, getUser, updateUser, updateUserPassword, updateUserPhoto } from "../controllers/user.js";

const router = express.Router()

router.get("/:id",getUser)
router.delete("/:id",deleteUser)
router.put("/:id",updateUser);
router.put("/password-change/:id",updateUserPassword);
router.put("/user-image-upload/:id", updateUserPhoto)

export default router
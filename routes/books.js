import { addBook, deleteBook, getBook, getBooks, searchBooks, updateBook } from "../controllers/books.js";
import express  from "express";

const router = express.Router()

router.get("/search/",searchBooks)
router.delete("/:id",deleteBook)
router.put("/:id",updateBook)
router.get("/:id",getBook)
router.get("/",getBooks)
router.post("/",addBook)

export default router
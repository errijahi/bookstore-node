import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const getBooks = (req,res) => {
    const q = req.query.cat ? "SELECT * FROM books WHERE cat=?" : " SELECT * FROM books";

    db.query(q,[req.query.cat],(err,data)=>{
        if(err) return res.send(err);

        return res.status(200).json(data);
    });
}

export const getBook = (req,res) => {
    const q = "SELECT p.id, `username`, `title`, `date`,`desc`, p.img, u.img AS userImg, `cat` FROM users u JOIN books p ON u.id=p.uid WHERE p.id = ?" ;

    db.query(q,[req.params.id],(err,data)=>{
        if(err) return res.json(err);

        return res.status(200).json(data[0]);
    });
}

export const searchBooks = (req,res) => {
    const q = req.query.cat ? "SELECT * FROM books WHERE cat=? AND title like '" + req.query.title + "%'" : " SELECT * FROM books WHERE title like '" + req.query.title + "%'";

    db.query(q,[req.query.cat],(err,data)=>{
        if(err) return res.send(err);

        return res.status(200).json(data);
    });
}

export const addBook = (req,res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token,"unama", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not vaild!")
    
        const q = "INSERT INTO books(`title`, `desc`,`img`, `cat`,`date`,`uid`) VALUES (?)"

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date, 
            userInfo.id,           
        ]
    
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(500).json(err)

            return res.json("Book has been created");
        })
    })
}

export const deleteBook = (req,res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token,"unama", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not vaild!")

        const bookId = req.params.id
        const q = "DELETE FROM books WHERE `id` = ? AND `uid` = ?";

        db.query(q,[bookId, userInfo.id], (err, data) =>{
            if(err) return res.status(403).json("You do not have permission for this opertion!BE GONE YOU LOSER !!!")
        
            return res.json("Book has been deleted!")
        })
    })
}

export const updateBook = (req,res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token,"unama", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not vaild!")

        const bookId = req.params.id;
        const q = "UPDATE books SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id`=? AND `uid` = ?";

        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,          
        ]
    
        db.query(q,[...values,bookId,userInfo.id],(err,data)=>{
            if(err) return res.status(500).json(err)

            return res.json("Book has been updated");
        })
    })
}
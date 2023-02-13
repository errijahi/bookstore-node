import jwt from "jsonwebtoken";
import {db} from "../db.js";
import bcrypt from "bcrypt";

export const getUser = (req,res) => {
    const q = "SELECT `username`, `email`, `img` FROM users WHERE id = ?" ;

    db.query(q,[req.params.id],(err,data)=>{
        if(err) return res.json(err);

        return res.status(200).json(data[0]);
    });
}

export const deleteUser = (req,res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token,"unama", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not vaild!")

       
        const q = "DELETE FROM users WHERE `id` = ? ";

        db.query(q,[userInfo.id], (err, data) =>{
            if(err) return res.status(403).json("You do not have permission for this opertion!BE GONE YOU LOSER !!!")
        
            return res.json("User has been deleted!")
        })
    })
}

export const updateUser = (req,res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token,"unama", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not vaild!")

        const q = "UPDATE users SET `username`=?,`email`=? WHERE `id`=?";

        const values = [
            req.body.username,
            req.body.email,         
        ]
    
        db.query(q,[...values,userInfo.id],(err,data)=>{
            if(err) return res.status(500).json(err)

            return res.json("User has been updated");
        })
    })
}

export const updateUserPhoto = (req,res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not authenticated!")

    jwt.verify(token,"unama", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not vaild!")

        const q = "UPDATE users SET `img`=? WHERE `id`=?";

        const values = [
            req.body.img,        
        ]
    
        db.query(q,[...values,userInfo.id],(err,data)=>{
            if(err) return res.status(500).json(err)

            return res.json("User's photo has been updated");
        })
    })
}


export const updateUserPassword = (req,res) => {

    //check user

    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.json(err);
        if(data.length === 0) return res.status(404).json("User does not exists!") 
    
         //cehck password
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)

    if(!isPasswordCorrect) return res.status(400).json("Wrong username or password!")

      //has the password and update a user
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.newPassword, salt);

      const q = "UPDATE users SET `password`=? WHERE `id`=?";

      db.query(q,[hash,req.body.id],(err,data)=>{
          if(err) return res.json(err);
          return res.status(200).json("User's password has been updadated.");
      })
    
    })
}
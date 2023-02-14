import booksRouter from "./routes/books.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import express from "express";
import multer from "multer";

import config from "./firebase.config.js";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import * as dotenv from 'dotenv'
dotenv.config()

const app = express();

import cors from "cors";
app.use(cors());

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", upload.single('file'), async( req,res) => {
  try{
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `files/${req.file.originalname + "-"+ dateTime}`);

    //Create file metadata inlcuding the content type
    const metadata = {
        contentType: req.file.mimetype,
    };

    //Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('File successefly uploaded.');
    return res.send({
      message: 'file uploaded to firebase storage',
      name: req.file.originalname,
      type: req.file.mimetype,
      downloadURL: downloadURL,
    })

  } catch (error) {
    return res.status(400).send(error.message)
  }
});

const giveCurrentDateTime = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDay();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + '-' + time;
  return dateTime;
}

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRouter);
app.use('/api/users',usersRouter);
app.use('/api/books',booksRouter);

app.listen(8800,()=>{
    console.log("Connected!")
})

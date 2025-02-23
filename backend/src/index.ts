import express from 'express'
import {router} from './routes/auth.router'
import { message } from './routes/message.router';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const mongodb = process.env.MONGODB_URL;

app.use("/api/v1",router);
app.use("/api/v1",message);

app.listen(3000,async()=>{
    console.log("Server is running on port 3000");
    await mongoose.connect(mongodb as string);
    console.log("connected to database successfully");
})
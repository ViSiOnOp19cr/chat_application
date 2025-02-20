import express from 'express'
import {authRoutes} from './routes/auth.router'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
const mongodb = process.env.MONGODB_URL;

app.use("/api/v1",authRoutes);

app.listen(3000,async()=>{
    console.log("Server is running on port 3000");
    await mongoose.connect(mongodb as string);
    console.log("connected to database successfully");
})
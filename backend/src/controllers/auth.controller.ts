import  {Request, Response} from 'express';
import {authmodel} from '../models/auth.models';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET:any = process.env.JWT_SECRET;
type user = {
    email:string;
    password:string;
}
export const signup = async(req:Request, res:Response)=>{
    try{
   const {email,password}:user = req.body;
    if(!email || !password){
         return res.status(400).json({message: "Email and password required"});
    }
    const user = new authmodel({
        email,
        password
    });
    await user.save();
    return res.status(201).json({message:"User created successfully"});
    
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}
export const login = async(req:Request, res:Response)=>{
    const {email,password}:user = req.body;
    try{
    if(!email || !password){
        return res.status(400).json({message:"Email and password required"});
    }
    const user = await authmodel.findOne({email});
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    
    const token = jwt.sign({
        email:user.email
    }, JWT_SECRET);
    return res.status(200).json({message:"Login successful", token})
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
    

}
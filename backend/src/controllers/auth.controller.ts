import  {Request, Response} from 'express';
import {authmodel} from '../models/auth.models';
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
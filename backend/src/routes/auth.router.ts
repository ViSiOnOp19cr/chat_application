
import express,{Request,Response} from 'express'
export const authRoutes = express.Router();
import {signup} from '../controllers/auth.controller'
authRoutes.post("/signup", async(req, res) => { 
    signup(req,res);
});
authRoutes.post("/login", async(req, res) => {
    
    signup(req,res);
});
authRoutes.post("/logout", async(req, res) => {
    
    signup(req,res);
});

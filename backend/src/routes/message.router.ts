import { authmiddleware } from '../middleware/middlewares';
import { Messages } from '../models/message.models';
import { getUsersForSidebar,getMessages, sendingMessage } from '../controllers/message.controller';

import express from 'express';
export const message = express.Router();

message.get("/getusers", authmiddleware , (req,res)=>{
    getUsersForSidebar(req,res);
});
message.get("/getmessages/:id", authmiddleware, (req,res)=>{
    getMessages(req,res);
});
message.post("/send/:id", authmiddleware, (req,res)=>{
    sendingMessage(req,res);
});
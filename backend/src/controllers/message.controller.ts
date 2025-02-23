import { authmodel } from "../models/auth.models";
import { Messages } from "../models/message.models";
import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
interface CustomRequest extends Request {
    userId?: string;
}
export const getUsersForSidebar = async (req: CustomRequest, res: Response) => {
    try {
        const loggedInUserId = req.userId as string;
        const filtetedUsers = await authmodel.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filtetedUsers);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getMessages = async (req: CustomRequest, res: Response) => {
    try {
        const { id: chaterId } = req.params;
        const myId = req.userId;
        const messages = Messages.find({
            $or: [
                {
                    senderId: chaterId, receiverId: myId
                },
                { senderId: chaterId, receiverId: myId }

            ]
        })
        res.status(200).json(messages);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "internal server error" });

    }
}
export const sendingMessage = async(req:CustomRequest,res:Response)=>{
    try{
        const senderId = req.userId;
        const {id:receiverId} = req.params;
        const {text,image} = req.body;
        let imageurl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageurl = uploadResponse.secure_url;
        }
        const updateMessage = await Messages.create({
            senderId,
            receiverId,
            text,
            image:imageurl
        });
        if(!updateMessage){
            res.status(400).json({messsage:"invalid filed"});
        }
        res.status(200).json(updateMessage);


    }catch(err){

    }
}
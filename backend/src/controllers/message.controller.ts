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
        const messages = await Messages.find({
            $or: [
                { senderId: chaterId, receiverId: myId },
                { senderId: myId, receiverId: chaterId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const sendingMessage = async(req: CustomRequest, res: Response) => {
    try {
        const senderId = req.userId;
        const {id: receiverId} = req.params;
        const {text, image} = req.body;
        
        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Sender and receiver are required" });
        }

        let imageurl;
        if(image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageurl = uploadResponse.secure_url;
            } catch (error) {
                console.error('Image upload failed:', error);
                return res.status(400).json({ message: "Image upload failed" });
            }
        }

        const newMessage = await Messages.create({
            senderId,
            receiverId,
            text,
            image: imageurl,
            createdAt: new Date()
        });

        if(!newMessage) {
            return res.status(400).json({message: "Failed to create message"});
        }

        const io = req.app.get('io');
        const onlineUsers = req.app.locals.onlineUsers;
        
        if (onlineUsers && onlineUsers[receiverId]) {
            io.to(onlineUsers[receiverId]).emit('getMessage', newMessage);
        }
        console.log(newMessage);
        res.status(201).json(newMessage);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}
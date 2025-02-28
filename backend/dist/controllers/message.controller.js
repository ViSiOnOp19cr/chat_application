"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendingMessage = exports.getMessages = exports.getUsersForSidebar = void 0;
const auth_models_1 = require("../models/auth.models");
const message_models_1 = require("../models/message.models");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const getUsersForSidebar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUserId = req.userId;
        const filtetedUsers = yield auth_models_1.authmodel.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filtetedUsers);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUsersForSidebar = getUsersForSidebar;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: chaterId } = req.params;
        const myId = req.userId;
        if (!chaterId || !myId) {
            return res.status(400).json({ message: "Invalid request parameters" });
        }
        const messages = yield message_models_1.Messages.find({
            $or: [
                { senderId: chaterId, receiverId: myId },
                { senderId: myId, receiverId: chaterId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMessages = getMessages;
const sendingMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const senderId = req.userId;
        const { id: receiverId } = req.params;
        const { text, image } = req.body;
        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Sender and receiver are required" });
        }
        let imageurl;
        if (image) {
            try {
                const uploadResponse = yield cloudinary_1.default.uploader.upload(image);
                imageurl = uploadResponse.secure_url;
            }
            catch (error) {
                console.error('Image upload failed:', error);
                return res.status(400).json({ message: "Image upload failed" });
            }
        }
        // Create the new message
        const newMessage = yield message_models_1.Messages.create({
            senderId,
            receiverId,
            text,
            image: imageurl,
            createdAt: new Date()
        });
        if (!newMessage) {
            return res.status(400).json({ message: "Failed to create message" });
        }
        const io = req.app.get('io');
        const onlineUsers = req.app.locals.onlineUsers;
        console.log('New message created:', newMessage._id);
        res.status(201).json(newMessage);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.sendingMessage = sendingMessage;

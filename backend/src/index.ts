import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { router } from './routes/auth.router'
import { message } from './routes/message.router';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Add supported methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Add allowed headers
}));
app.set('io', io);

const mongodb = process.env.MONGODB_URL;

app.use("/api/v1",router);
app.use("/api/v1",message);

// Move onlineUsers to app.locals for global access
app.locals.onlineUsers = {};

io.on('connection', (socket: any) => {
    console.log('New client connected:', socket.id);

    socket.on('addUser', (userId: string) => {
        app.locals.onlineUsers[userId] = socket.id;
        io.emit('getOnlineUsers', Object.keys(app.locals.onlineUsers));
        console.log('Online Users:', app.locals.onlineUsers);
    });

    socket.on('sendMessage', (data:any) => {
        const receiverSocketId = app.locals.onlineUsers[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('getMessage', data);
        }
    });

    socket.on('typing', (data:any) => {
        const receiverSocketId = app.locals.onlineUsers[data.receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', data.senderId);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        for (const [userId, socketId] of Object.entries(app.locals.onlineUsers)) {
            if (socketId === socket.id) {
                delete app.locals.onlineUsers[userId];
                break;
            }
        }
        io.emit('getOnlineUsers', Object.keys(app.locals.onlineUsers));
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, async()=>{
    console.log("Server is running on port " + PORT);
    try {
        await mongoose.connect(mongodb as string);
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})
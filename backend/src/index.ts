import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { router } from './routes/auth.router';
import { message } from './routes/message.router';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Redis from 'ioredis';
import { createAdapter } from "@socket.io/redis-adapter"; 


dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

const pub = new Redis();
const sub = new Redis();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('io', io);

io.adapter(createAdapter(pub,sub));

const mongodb = process.env.MONGODB_URL;

app.use("/api/v1", router);
app.use("/api/v1", message);



io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('addUser', async (userId) => {
        if (userId) {
            await pub.hset("online_users", userId, socket.id);
            const users = await pub.hkeys("online_users");
            io.emit("getonlineusers", users);
        }

    });

    socket.on('sendMessage', async (data) => {
        const receiverId = data.receiverId;
        if (!receiverId) return;
        const receiversocketId = await pub.hget("online_users", receiverId);
        if (receiversocketId) {
            io.to(receiversocketId).emit('getMessage', data.message);
        }
    });


    socket.on('disconnect', async () => {
        const onlineUsers = await pub.hgetall("online_users");

        const userId = Object.keys(onlineUsers).find(
            key => onlineUsers[key] === socket.id
        );

        if (userId) {
            await pub.hdel("online_users", userId);
            const users = await pub.hkeys("online_users");
            io.emit("getonlineusers", users);
        }
        console.log("Disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, async() => {
    console.log("Server is running on port " + PORT);
    try {
        await mongoose.connect(mongodb as string);
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});
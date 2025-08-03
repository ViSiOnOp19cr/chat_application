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
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const auth_router_1 = require("./routes/auth.router");
const message_router_1 = require("./routes/message.router");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis_adapter_1 = require("@socket.io/redis-adapter");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});
const pub = new ioredis_1.default();
const sub = new ioredis_1.default();
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('io', io);
io.adapter((0, redis_adapter_1.createAdapter)(pub, sub));
const mongodb = process.env.MONGODB_URL;
app.use("/api/v1", auth_router_1.router);
app.use("/api/v1", message_router_1.message);
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('addUser', (userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (userId) {
            yield pub.hset("online_users", userId, socket.id);
            const users = yield pub.hkeys("online_users");
            io.emit("getonlineusers", users);
        }
    }));
    socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const receiverId = data.receiverId;
        if (!receiverId)
            return;
        const receiversocketId = yield pub.hget("online_users", receiverId);
        if (receiversocketId) {
            io.to(receiversocketId).emit('getMessage', data.message);
        }
    }));
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        const onlineUsers = yield pub.hgetall("online_users");
        const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
        if (userId) {
            yield pub.hdel("online_users", userId);
            const users = yield pub.hkeys("online_users");
            io.emit("getonlineusers", users);
        }
        console.log("Disconnected:", socket.id);
    }));
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Server is running on port " + PORT);
    try {
        yield mongoose_1.default.connect(mongodb);
        console.log("Connected to database successfully");
    }
    catch (error) {
        console.error("Database connection failed:", error);
    }
}));

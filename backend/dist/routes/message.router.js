"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
const middlewares_1 = require("../middleware/middlewares");
const message_controller_1 = require("../controllers/message.controller");
const express_1 = __importDefault(require("express"));
exports.message = express_1.default.Router();
exports.message.get("/getusers", middlewares_1.authmiddleware, (req, res) => {
    (0, message_controller_1.getUsersForSidebar)(req, res);
});
exports.message.get("/getmessages/:id", middlewares_1.authmiddleware, (req, res) => {
    (0, message_controller_1.getMessages)(req, res);
});
exports.message.post("/send/:id", middlewares_1.authmiddleware, (req, res) => {
    (0, message_controller_1.sendingMessage)(req, res);
});

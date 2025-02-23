"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authmiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authmiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send({
            message: 'unauthorized'
        });
        return;
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (decoded) {
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            });
            return;
        }
        req.userId = decoded.id;
        console.log(decoded);
        next();
    }
    else {
        res.status(401).send({
            message: 'unauthorized'
        });
    }
};
exports.authmiddleware = authmiddleware;

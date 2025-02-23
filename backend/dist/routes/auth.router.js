"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const middlewares_1 = require("../middleware/middlewares");
exports.router = express_1.default.Router();
exports.router.post("/signup", (req, res) => {
    (0, auth_controller_1.signup)(req, res);
});
exports.router.post("/login", (req, res) => {
    (0, auth_controller_1.login)(req, res);
});
exports.router.put("/update-profile", middlewares_1.authmiddleware, (req, res) => {
    (0, auth_controller_1.updateProfile)(req, res);
});
exports.router.get("/check", middlewares_1.authmiddleware, (req, res) => {
    (0, auth_controller_1.checkAuth)(req, res);
});

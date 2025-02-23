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
exports.checkAuth = exports.updateProfile = exports.login = exports.signup = void 0;
const auth_models_1 = require("../models/auth.models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        const userExists = yield auth_models_1.authmodel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedpassword = yield bcrypt_1.default.hash(password, 10);
        const user = new auth_models_1.authmodel({
            email,
            password: hashedpassword,
            fullName
        });
        yield user.save();
        return res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        const user = yield auth_models_1.authmodel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordcorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordcorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id
        }, JWT_SECRET);
        return res.status(200).json({ message: "Login successful", token });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profilePic } = req.body;
        const userId = req.body._id;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture required" });
        }
        const user = yield auth_models_1.authmodel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const uploadResponse = yield cloudinary_1.default.uploader.upload(profilePic);
        user.profilePic = uploadResponse.secure_url;
        yield user.save();
        return res.status(200).json({ message: "Profile picture updated successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProfile = updateProfile;
const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.body);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.checkAuth = checkAuth;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const jwt_1 = require("../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }
    const existingUser = await db_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await db_1.default.user.create({
            data: { name, email, password: hashedPassword, role: role || 'user' },
        });
        res.json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    try {
        const user = await db_1.default.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role, user.name, user.email);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id, user.role, user.name, user.email);
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await db_1.default.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(user.id, user.role, user.name, user.email);
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};
exports.refreshToken = refreshToken;

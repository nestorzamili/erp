"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/auth/register', auth_controller_1.register);
router.post('/auth/login', auth_controller_1.login);
router.post('/auth/refresh-token', auth_controller_1.refreshToken);
router.get('/admin', auth_middleware_1.isAdmin, (req, res) => {
    res.json({ message: 'Admin route' });
});
router.get('/profile', auth_middleware_1.authMiddleware, (req, res) => {
    const userId = req.body.userId;
    const role = req.body.role;
    const name = req.body.name;
    const email = req.body.email;
    res.json({ userId, role, name, email });
});
exports.default = router;

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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../prisma");
const utils_1 = require("../utils");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Register
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return (0, utils_1.sendError)(res, 400, 'Please provide all fields');
        }
        const existingUser = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return (0, utils_1.sendError)(res, 400, 'User already exists');
        }
        const hashedPassword = yield (0, utils_1.hashPassword)(password);
        const user = yield prisma_1.prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        const token = (0, utils_1.generateToken)(user.id);
        (0, utils_1.sendSuccess)(res, { user, token });
    }
    catch (error) {
        (0, utils_1.sendError)(res, 500, 'Something went wrong');
    }
}));
// Login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, utils_1.sendError)(res, 400, 'Please provide email and password');
        }
        const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return (0, utils_1.sendError)(res, 401, 'Invalid credentials');
        }
        const isMatch = yield (0, utils_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return (0, utils_1.sendError)(res, 401, 'Invalid credentials');
        }
        const token = (0, utils_1.generateToken)(user.id);
        (0, utils_1.sendSuccess)(res, { user, token });
    }
    catch (error) {
        (0, utils_1.sendError)(res, 500, 'Something went wrong');
    }
}));
// Get current user
router.get('/me', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, utils_1.sendSuccess)(res, req.user);
}));
exports.default = router;

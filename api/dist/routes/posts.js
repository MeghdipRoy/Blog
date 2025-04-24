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
// Create post
router.post('/', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return (0, utils_1.sendError)(res, 400, 'Please provide title and content');
        }
        const post = yield prisma_1.prisma.post.create({
            data: {
                title,
                content,
                userId: req.user.id,
            },
        });
        (0, utils_1.sendSuccess)(res, post);
    }
    catch (error) {
        (0, utils_1.sendError)(res, 500, 'Something went wrong');
    }
}));
// Get all posts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma_1.prisma.post.findMany({
            include: { user: { select: { name: true, email: true } } },
        });
        (0, utils_1.sendSuccess)(res, posts);
    }
    catch (error) {
        (0, utils_1.sendError)(res, 500, 'Something went wrong');
    }
}));
// Get single post
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield prisma_1.prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { user: { select: { name: true, email: true } } },
        });
        if (!post) {
            return (0, utils_1.sendError)(res, 404, 'Post not found');
        }
        (0, utils_1.sendSuccess)(res, post);
    }
    catch (error) {
        (0, utils_1.sendError)(res, 500, 'Something went wrong');
    }
}));
// Update post
router.put('/:id', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return (0, utils_1.sendError)(res, 400, 'Please provide title and content');
        }
        const post = yield prisma_1.prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!post) {
            return (0, utils_1.sendError)(res, 404, 'Post not found');
        }
        if (post.userId !== req.user.id) {
            return (0, utils_1.sendError)(res, 403, 'Not authorized to update this post');
        }
        const updatedPost = yield prisma_1.prisma.post.update({
            where: { id: post.id },
            data: { title, content },
        });
        (0, utils_1.sendSuccess)(res, updatedPost);
    }
    catch (error) {
        (0, utils_1.sendError)(res, 500, 'Something went wrong');
    }
}));
// Delete post
router.delete('/:id', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield prisma_1.prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!post) {
            return (0, utils_1.sendError)(res, 404, 'Post not found');
        }
        if (post.userId !== req.user.id) {
            return (0, utils_1.sendError)(res, 403, 'Not authorized to delete this post');
        }
        yield prisma_1.prisma.post.delete({ where: { id: post.id } });
        (0, utils_1.sendSuccess)(res, { message: 'Post deleted successfully' });
    }
    catch (error) {
        (0, utils_1.sendError)(res, 500, 'Something went wrong');
    }
}));
exports.default = router;

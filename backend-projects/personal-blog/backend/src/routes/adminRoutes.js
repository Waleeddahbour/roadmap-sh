import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addNewArticle, deleteArticle, editArticle, getAdminArticles } from "../controllers/adminControllers.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware);

router.get('/', asyncHandler(getAdminArticles));
router.post('/new', asyncHandler(addNewArticle));
router.patch('/edit/:id', asyncHandler(editArticle));
router.delete('/delete/:id', asyncHandler(deleteArticle));

export default router;
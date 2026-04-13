import express from "express";
import { getArticles } from "../controllers/guestControllers.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get('/', asyncHandler(getArticles));

export default router;
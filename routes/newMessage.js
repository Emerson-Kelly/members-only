import express from "express";
import { newMessageGet, newMessagePost, deleteMessage } from "../controllers/newMessageController.js";

const router = express.Router();

// Show the new post form
router.get("/new-message", newMessageGet);

// Handle new post submission
router.post("/new-message", newMessagePost);

// Handle Post Removals from Admins
router.post("/post/:id/delete", deleteMessage);

export { router as newMessageRouter };
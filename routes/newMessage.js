import express from "express";
import { newMessageGet, newMessagePost } from "../controllers/newMessageController.js";

const router = express.Router();

// Show the new post form
router.get("/new-message", newMessageGet);

// Handle new post submission
router.post("/new-message", newMessagePost);

export { router as newMessageRouter };
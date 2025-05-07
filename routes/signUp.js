import express from "express";
import {
  usersCreateGet,
  usersCreatePost,
} from "../controllers/usersController.js";

const router = express.Router();

// Show the sign-up form
router.get("/sign-up", usersCreateGet);

// Handle sign-up form submission
router.post("/sign-up", usersCreatePost);

export { router as usersRouter };
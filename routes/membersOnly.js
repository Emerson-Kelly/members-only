import express from "express";
import { membersUpdateGet ,membersUpdatePost } from "../controllers/membershipController.js";

const router = express.Router();

// Show the members only form
router.get("/members-only", membersUpdateGet);

// Handle members only form submission
router.post("/members-only", membersUpdatePost);

export { router as membersOnlyRouter };
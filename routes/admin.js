import express from "express";
import { membersUpdateGet ,membersUpdatePost } from "../controllers/membershipController.js";
import { adminUpdateGet, adminUpdatePost } from "../controllers/adminController.js";

const router = express.Router();

// Show the admin form
router.get("/admin",adminUpdateGet);

// Handle admin form submission
router.post("/admin", adminUpdatePost);

export { router as adminRouter };
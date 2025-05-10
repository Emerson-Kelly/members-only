import { pool } from "../db/pool.js";
import { body, validationResult } from "express-validator";

const memberErr = "Please enter the correct password.";
const memberPassword = "exclusivemember123";

const validateMember = [
  body("membership-status")
    .equals(memberPassword)
    .withMessage(memberErr)
];

export const membersUpdateGet = async (req, res) => {
    try {
      const { rows: allMembers } = await pool.query("SELECT * FROM users WHERE membership_status = true");
  
      res.render("pages/members-only", {
        title: "Create member",
        users: allMembers,
        errors: [],
      });
    } catch (err) {
      console.error(err);
      res.status(500).render("pages/members-only", {
        title: "Create member",
        errors: [{ msg: "Something went wrong while loading admins." }],
      });
    }
  };

export const membersUpdatePost = [
  validateMember,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("pages/members-only", {
        title: "Members Only",
        errors: errors.array(),
      });
    }

    try {
      const userId = req.user.id;

      await pool.query(
        `UPDATE users SET membership_status = true WHERE id = $1`,
        [userId]
      );

      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).render("pages/members-only", {
        title: "Members Only",
        errors: [{ msg: "Something went wrong. Please try again." }],
      });
    }
  },
];

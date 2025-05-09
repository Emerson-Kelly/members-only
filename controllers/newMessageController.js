import { pool } from "../db/pool.js";
import { body, validationResult } from "express-validator";

const lengthErr = "Must be between 1 and 10 characters.";

const validateNewMessage = [
  body("title").isLength({ min: 1, max: 200 }).withMessage(lengthErr),

  body("content").isLength({ min: 1, max: 200 }).withMessage(lengthErr),
];

export const newMessageGet = async (req, res) => {
  res.render("pages/new-message", {
    title: "New Message",
    errors: [],
  });
};

export const newMessagePost = [
  validateNewMessage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("pages/new-message", {
            title: "New Message",
            errors: errors.array(),
            user: req.user,
          });
    }

    try {
      const userId = req.user.id;

      await pool.query(
        `INSERT INTO messages (user_id, title, content) VALUES ($1, $2, $3)`,
        [userId, req.body.title, req.body["content"]]
      );
      
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).render("pages/new-message",  {
        title: "New Message",
        errors: [{ msg: "Something went wrong. Please try again." }],
      });
    }
  },
];

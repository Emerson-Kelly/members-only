import { pool } from "../db/pool.js";
import { body, query, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

// Error messages
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const ageErr = "must be a number between 18 and 120.";

// Utility function to capitalize first letter of each name
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Validation rules for user input
const validateUser = [
  body("firstName")
    .trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`)
    .escape(),

  body("lastName")
    .trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`)
    .escape(),

  body("email")
    .trim()
    .isEmail().withMessage("Not a valid e-mail address")
    .normalizeEmail(),

  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage("Password must be at least 8 characters and include uppercase, lowercase, and a number.")
    .escape(),

  body("confirmPassword")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match.")
    .escape(),
];

// Controller to get list of users and their messages
export const usersListGet = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        messages.id AS message_id,
        messages.text AS message_text,
        messages.created_at,
        users.id AS user_id,
        users.first_name,
        users.last_name,
        users.username
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY messages.created_at DESC
    `);

    res.render("index", {
      title: "Home",
      messages: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

// Controller to render sign-up page
export const usersCreateGet = (req, res) => {
  res.render("pages/sign-up", {
    title: "Create user",
    errors: [],
  });
};

// Controller to handle sign-up form submission
export const usersCreatePost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("pages/sign-up", {
        title: "Sign-Up",
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      // Hash the password before saving to the DB
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `INSERT INTO users (first_name, last_name, username, password_hash, membership_status, created_at)
         VALUES ($1, $2, $3, $4, false, CURRENT_TIMESTAMP)`,
        [capitalize(firstName), capitalize(lastName), email, hashedPassword]
      );

      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).render("pages/sign-up", {
        title: "Sign-Up",
        errors: [{ msg: "Something went wrong. Please try again." }],
      });
    }
  },
];

// Controller to render update user page
export const usersUpdateGet = async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  const user = result.rows[0];
  res.render("updateUser", { title: "Update user", user });
};

// Controller to handle update user form submission
export const usersUpdatePost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    const { firstName, lastName, email } = req.body;
    const userId = req.params.id;

    if (!errors.isEmpty()) {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: result.rows[0],
        errors: errors.array(),
      });
    }

    try {
      await pool.query(
        `UPDATE users SET first_name = $1, last_name = $2, username = $3 WHERE id = $4`,
        [capitalize(firstName), capitalize(lastName), email, userId]
      );

      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  },
];

// Controller to handle deleting a user
export const usersDeletePost = async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

// Controller to handle search for a user by name
export const usersSearchGet = [
  query("name")
    .trim()
    .isAlpha().withMessage("Search must only contain letters.")
    .escape(),
  async (req, res) => {
    const errors = validationResult(req);
    const name = req.query.name;

    let foundUser = null;
    if (errors.isEmpty()) {
      const result = await pool.query(
        `SELECT * FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1`,
        [`%${name}%`]
      );
      foundUser = result.rows;
    }

    res.render("searchUser", {
      title: "User Search Result",
      name,
      foundUser,
      validateSearch: errors.isEmpty() ? null : errors.array()[0].msg,
      errors: errors.array(),
    });
  },
];

// Controller to handle search form submission
export const usersSearchPost = (req, res) => {
  const { name } = req.body;
  res.redirect(`/search?name=${encodeURIComponent(name)}`);
};

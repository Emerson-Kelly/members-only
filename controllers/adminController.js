import { pool } from "../db/pool.js";
import { validationResult } from "express-validator";

// Controller for GET request to show admin page
export const adminUpdateGet = async (req, res) => {
  try {
    // Query the database to get all users who are admins
    const { rows: allAdmins } = await pool.query("SELECT * FROM users WHERE admin = true");

    // Render the page with all admins
    res.render("pages/admin", {
      title: "Admin",
      users: allAdmins,  // Pass admins to the view
      errors: [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("pages/admin", {
      title: "Admin",
      errors: [{ msg: "Something went wrong while loading admins." }],
    });
  }
};

// Controller for POST request to update user to admin
export const adminUpdatePost = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("pages/admin", {
        title: "Admin",
        errors: errors.array(),
      });
    }

    try {
      const userId = req.user.id;

      // Update the current user's admin status
      await pool.query(
        `UPDATE users SET admin = true WHERE id = $1`,
        [userId]
      );

      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).render("pages/admin", {
        title: "Admin",
        errors: [{ msg: "Something went wrong. Please try again." }],
      });
    }
  },
];

import { pool } from "../db/pool.js";

export const indexGet = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT messages.*, users.first_name, users.last_name
       FROM messages
       JOIN users ON messages.user_id = users.id
       ORDER BY messages.timestamp DESC`
    );

    const messages = result.rows;

    res.render("pages/index", {
      title: "Home",
      user: req.user,
      messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("pages/index", {
        title: "Home",
        user: req.user,
        messages: [],
        errors: [{ msg: "Could not load messages." }],
      });
      
  }
};

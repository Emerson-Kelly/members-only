#!/usr/bin/env node
/*
import dotenv from 'dotenv';
dotenv.config();

import clientPkg from 'pg';
const { Client } = clientPkg;

const SQL = `
  DROP TABLE IF EXISTS messages;
  DROP TABLE IF EXISTS users;

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    membership_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  );
`;

const mockData = {
  users: [
    { first_name: 'John', last_name: 'Doe', username: 'john_doe', password_hash: 'hashed_password_1' },
    { first_name: 'Jane', last_name: 'Smith', username: 'jane_smith', password_hash: 'hashed_password_2' },
    { first_name: 'Alex', last_name: 'Rose', username: 'alex_rose', password_hash: 'hashed_password_3' },
    { first_name: 'Susan', last_name: 'Brown', username: 'susan_brown', password_hash: 'hashed_password_4' },
  ],
  messages: [
    { title: 'Hello World', content: 'This is a test message.', username: 'john_doe' },
    { title: 'Test Message', content: 'Hello everyone!', username: 'jane_smith' },
    { title: 'Question', content: 'Is anyone there?', username: 'alex_rose' },
    { title: 'Good Morning', content: 'Hope you have a great day!', username: 'susan_brown' },
  ],
};

async function main() {
  console.log("Seeding database...");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  await client.query(SQL);

  // Insert mock users into the 'users' table
  for (const user of mockData.users) {
    await client.query(
      'INSERT INTO users (first_name, last_name, username, password_hash) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING',
      [user.first_name, user.last_name, user.username, user.password_hash]
    );
  }

  // Insert mock messages into the 'messages' table
  for (const message of mockData.messages) {
    // Fetch user_id for the username
    const res = await client.query('SELECT id FROM users WHERE username = $1', [message.username]);
    const userId = res.rows[0]?.id;

    if (userId) {
      await client.query(
        'INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3)',
        [message.title, message.content, userId]
      );
    }
  }

  await client.end();
  console.log("done");
}

main();
*/
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

console.log(process.env.DATABASE_URL)

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'db',
  port: 5432,
  database: 'postgres'
});

function connect() {
  pool.connect((err, client, release) => {
    if (err) {
      if (err.message === 'the database system is starting up') {
        console.log('Database is starting up, retrying in 2 seconds...');
        setTimeout(connect, 2000);
        return;
      }
      return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
      release();
      if (err) {
        return console.error('Error executing query', err.stack);
      }
      console.log('Connected to PostgreSQL on', result.rows[0].now);
    });
  });
}

connect();

app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

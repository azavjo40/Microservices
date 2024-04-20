const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

console.log('app-one')

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'db',
  port: 5432,
  database: 'postgres'
});

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

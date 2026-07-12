import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose'; // Moved up with other imports
import connectDB from './config/db.js';
import { Pool } from './models/Pool.js';
import { createPool } from './controllers/dbcontroller.js';

dotenv.config();

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
// Routes
app.get('/homepage/:id', (req, res) => {
  console.log(req.body);
  res.send('Hello World!');
});

app.post('/homepage/:id', (req, res) => {
  console.log(req.body);
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
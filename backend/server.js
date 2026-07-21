import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose'; // Moved up with other imports
import connectDB from './config/db.js';
import { Pool } from './models/Pool.js';


import authRoutes from './routes/auth.js';
import inboxRoutes from "./routes/inbox.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/auth",authRoutes);
app.use("/inbox",inboxRoutes)


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
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Moved up with other imports
import connectDB from './config/db.js';
import { Pool } from './models/Pool.js';
import { createPool } from './controllers/dbcontroller.js';

dotenv.config();

const app = express();
const port = 3000;

// Body parsing middleware (fixes req.body returning undefined)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dummyPool = {
  subscription: {
    name: "Netflix",
    monthly_cost: 15.99,
    category: "Entertainment",
    billingCycle: "Monthly"
  },
  maxMembers: 4,
  members: [
    new mongoose.Types.ObjectId(), 
    new mongoose.Types.ObjectId()
  ],
  currency: "USD",
  author: new mongoose.Types.ObjectId(), 
  status: "Active"
};

// FIXED: Properly awaiting the database before inserting data


// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', (req, res) => {
  console.log(req.body); // Express uses req.body, req.form is invalid
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
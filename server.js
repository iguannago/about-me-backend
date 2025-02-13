require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch((err) => console.error('MongoDB Connection Error ❌:', err));

const ExpenseSchema = new mongoose.Schema({
  person: String,
  amount: Number,
});

const Expense = mongoose.model('Expense', ExpenseSchema);

app.get('/expenses', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.post('/expenses', async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.status(201).json(expense);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.SECRET_KEY;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch((err) => console.error('MongoDB Connection Error  ❌:', err));

const ExpenseSchema = new mongoose.Schema({
  person: String,
  amount: Number,
});

const Expense = mongoose.model('Expense', ExpenseSchema);

// Login endpoint to generate JWT for Fatima
app.post('/login', (req, res) => {
  const { userId } = req.body;
  if (userId === '34771453F') {
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Unauthorized' });
});

// Middleware for authenticating requests
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    if (decoded.userId !== '34771453F')
      return res.status(403).json({ error: 'Forbidden' });
    next();
  });
};

// Secure expenses endpoint
app.get('/expenses', authenticate, async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.post('/expenses', authenticate, async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.status(201).json(expense);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

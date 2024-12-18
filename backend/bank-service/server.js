const express = require('express');
const app = express();
const PORT = 3002;
const cors = require('cors');
app.use(cors());
let balance = 1000;

app.use(express.json());

app.post('/deposit', (req, res) => {
  const { amount } = req.body;
  if (amount > 0) {
    balance += amount;
    return res.status(200).json({ message: 'Deposit successful', balance });
  }
  return res.status(400).json({ message: 'Invalid deposit amount' });
});

app.listen(PORT, () => {
  console.log(`Bank service running on port ${PORT}`);
});
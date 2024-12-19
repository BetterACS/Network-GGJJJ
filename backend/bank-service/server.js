const express = require('express');
const app = express();
const PORT = 3002;
const cors = require('cors');

// Configure CORS with specific origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());


app.post('/deposit', (req, res) => {
  const { amount,balance } = req.body;
  // console.log(amount,balance);
  if (amount > 0) {
    let newBalance = Number(amount) + Number(balance);
    console.log(newBalance);
    // balance += amount;
    return res.status(200).json({ message: 'Deposit successful', balance:newBalance });
  }
  return res.status(400).json({ message: 'Invalid deposit amount' });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
app.listen(PORT, () => {
  console.log(`Bank service running on port ${PORT}`);
});
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

simple_database = {"user":0};

app.post('/deposit', (req, res) => {
  const { amount,user } = req.body;
  console.log(amount,user);
  if (amount > 0) {
    let newBalance = Number(amount) + Number(simple_database[user]);
    console.log("new Balance",newBalance,);
    simple_database[user] = newBalance;
    // balance += amount;
    return res.status(200).json({ message: 'Deposit successful', balance:newBalance });
  }
  return res.status(400).json({ message: 'Invalid deposit amount' });
});

app.post('/withdraw', (req, res) => {
  const { amount,user } = req.body;
  console.log(amount,user);
  if (amount > 0) {
    if (simple_database[user] >= amount) {
      let newBalance = Number(simple_database[user]) - Number(amount);
      simple_database[user] = newBalance;
      return res.status(200).json({ message: 'Withdrawal successful', balance:newBalance });
    }
    return res.status(400).json({ message: 'Insufficient funds' });
  }
  return res.status(400).json({ message: 'Invalid withdrawal amount' });
});


app.get('/balance', (req, res) => {
  const user = req.query.user;
  // console.log("user",user);
  if (user in simple_database) {
    return res.status(200).json({ balance: simple_database[user] });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
app.listen(PORT, () => {
  console.log(`Bank service running on port ${PORT}`);
});
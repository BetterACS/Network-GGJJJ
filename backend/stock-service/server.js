const express = require('express');
const app = express();
const PORT = 3003;
const cors = require('cors');
app.use(cors());
let stockPrice = 100;

app.use(express.json());

app.post('/buy', (req, res) => {
  const { amount } = req.body;
  if (amount >= stockPrice) {
    return res.status(200).json({ message: 'Stock bought successfully' });
  }
  return res.status(400).json({ message: 'Insufficient funds to buy stock' });
});

app.listen(PORT, () => {
  console.log(`Stock service running on port ${PORT}`);
});

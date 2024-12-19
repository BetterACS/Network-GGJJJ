const express = require('express');
const app = express();
const PORT = 3003;
const cors = require('cors');

// Configure CORS with specific origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());


app.post('/buy', (req, res) => {
  const { stockPrice,balance } = req.body;
  // console.log(stockPrice,balance);
  if (balance >= stockPrice) {
    return res.status(200).json({ message: 'Stock bought successfully',balance:Number(balance)-Number(stockPrice) });
  }
  return res.status(400).json({ message: 'Insufficient funds to buy stock',error: 'Insufficient funds to buy stock'});
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
app.listen(PORT, () => {
  console.log(`Stock service running on port ${PORT}`);
});
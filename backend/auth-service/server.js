const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');

// Configure CORS with specific origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user' && password === 'password') {
    return res.status(200).json({ message: 'Authenticated' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
import React, { useState } from 'react';
import { authenticate, deposit, buyStock } from './Api';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const authResponse = await authenticate(username, password);
    setMessage(authResponse.message);
  };

  const handleDeposit = async (amount) => {
    const depositResponse = await deposit(amount);
    setBalance(depositResponse.balance);
    setMessage(depositResponse.message);
  };

  const handleBuyStock = async (amount) => {
    const stockResponse = await buyStock(amount);
    if (stockResponse.message.includes('Insufficient funds')) {
      await handleDeposit(amount); // If stock purchase fails, deposit money into bank
    }
    setMessage(stockResponse.message);
  };

  return (
    <div>
      <h1>Microservices Example</h1>
      <div>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>

      <div>
        <h2>Balance: {balance}</h2>
        <button onClick={() => handleDeposit(500)}>Deposit 500</button>
        <button onClick={() => handleBuyStock(200)}>Buy Stock (200)</button>
      </div>

      <div>{message && <p>{message}</p>}</div>
    </div>
  );
};

export default App;

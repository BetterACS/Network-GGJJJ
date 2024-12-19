import React, { useState, useEffect, use } from 'react';
import { authenticate, deposit, buyStock, checkServices, getBalance } from './Api';


const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [servicesStatus, setServicesStatus] = useState({
    auth: false,
    bank: false,
    stock: false
  });

  useEffect(() => {
    const initialize = async () => {
      const status = await checkServiceStatus(); 
      console.log("service", status);
    
      let storedUser = '';
      if (status && status.auth) { 
        storedUser = sessionStorage.getItem('user');
      }
    
      if (storedUser) {
        setIsAuthenticated(true);
        setUsername(storedUser);
        if (status && status.bank) fetchBalance(storedUser);
      }
    };
    
    initialize();
  }, []);

  const checkServiceStatus = async () => {
    const status = await checkServices();
    setServicesStatus(status); 
    return status; 
  };
  

  const fetchBalance = async (user) => {
    const balanceResponse = await getBalance(user);
    if (!balanceResponse.error) {
      setBalance(balanceResponse.balance);
    }
  };
  
 
  
  useEffect(() => {
    checkServiceStatus();
  }, [isAuthenticated, balance]);
  
  const handleLogin = async () => {
    const authResponse = await authenticate(username, password);
    if (authResponse.serviceDown) {
      setServicesStatus(prev => ({ ...prev, auth: false }));
      setIsAuthenticated(false);
    } else if (authResponse.error) {
      setMessage(authResponse.message);
    } else {
      setIsAuthenticated(true);
      setMessage(authResponse.message);
      sessionStorage.setItem('user', username);
      fetchBalance(username);
      setServicesStatus(prev => ({ ...prev, auth: true }));
    }
  };

  const handleDeposit = async (amount,user) => {
    if (!isAuthenticated) {
      setMessage('Please login first');
      return;
    }

    const depositResponse = await deposit(amount,user);
    if (depositResponse.serviceDown) {
      setServicesStatus(prev => ({ ...prev, bank: false }));
    } else if (depositResponse.error) {
      setMessage(depositResponse.message);
    } else {
      console.log(depositResponse.balance );
      setBalance(depositResponse.balance);
      // sessionStorage.setItem('balance', depositResponse.balance);
      setMessage(depositResponse.message);
      setServicesStatus(prev => ({ ...prev, bank: true }));
    }
  };

  const handleBuyStock = async (user,stockPrice,balance) => {
    if (!isAuthenticated) {
      setMessage('Please login first');
      return;
    }

    const stockResponse = await buyStock(user,stockPrice,balance);
    console.log(stockResponse);
    if (stockResponse.serviceDown) {
      setServicesStatus(prev => ({ ...prev, stock: false }));
    } else if (stockResponse.error) {
      setMessage(stockResponse.message);
    } else {
      setMessage(stockResponse.message);
      setBalance(stockResponse.balance);
      // sessionStorage.setItem('balance', stockResponse.balance);
      setServicesStatus(prev => ({ ...prev, stock: true }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Microservices Example</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Services Status</h2>
        <div className="space-y-1">
          <div>Auth Service: {servicesStatus.auth ? '🟢 Online' : '🔴 Offline'}</div>
          <div>Bank Service: {servicesStatus.bank ? '🟢 Online' : '🔴 Offline'}</div>
          <div>Stock Service: {servicesStatus.stock ? '🟢 Online' : '🔴 Offline'}</div>
        </div>
      </div>

      {!isAuthenticated&&<div className="mb-4">
        <h2 className="text-xl mb-2">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mr-2"
        />
        <button 
          onClick={handleLogin}
          disabled={!servicesStatus.auth}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Login
        </button>
      </div>
      }
      {isAuthenticated && (
        <div className="mb-4">
          <h2 className="text-xl">Balance: {balance}฿</h2>
          <div className="space-x-2 mt-2">
            <button 
              onClick={() => handleDeposit(500,username)}
              disabled={!servicesStatus.bank || !servicesStatus.auth}
              className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              Deposit 500
            </button>
            <button 
              onClick={() => handleBuyStock(username,200,balance)}
              disabled={!servicesStatus.stock || !servicesStatus.bank || !servicesStatus.auth}
              className="bg-purple-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              Buy Stock (200)
            </button>
          </div>
        </div>
      )}
      {isAuthenticated && (
        <button 
          onClick={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem('isAuthenticated');
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      )}

      {message && (
        <div className="mt-4 p-2 border rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
// src/Api.js
const apiBaseUrlAuth = 'http://localhost:3001';
const apiBaseUrlBank = 'http://localhost:3002';
const apiBaseUrlStock = 'http://localhost:3003';

// Helper to check if a service is available
const checkService = async (url) => {
  try {
    const response = await fetch(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const authenticate = async (username, password) => {
  try {
    const response = await fetch(`${apiBaseUrlAuth}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    return response.json();
  } catch (error) {
    console.error('Auth error:', error);
    return { 
      message: 'Authentication service is unavailable', 
      error: true,
      serviceDown: true 
    };
  }
};

export const deposit = async (amount) => {
  try {
    // First check if user is authenticated (auth service is up)
    const authCheck = await checkService(apiBaseUrlAuth);
    if (!authCheck) {
      return { 
        message: 'Authentication service is down, please try again later', 
        error: true 
      };
    }

    const response = await fetch(`${apiBaseUrlBank}/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      throw new Error('Deposit failed');
    }
    return response.json();
  } catch (error) {
    console.error('Deposit error:', error);
    return { 
      message: 'Bank service is unavailable', 
      error: true,
      serviceDown: true 
    };
  }
};

export const buyStock = async (amount) => {
  try {
    // First check if user is authenticated (auth service is up)
    const authCheck = await checkService(apiBaseUrlAuth);
    if (!authCheck) {
      return { 
        message: 'Authentication service is down, please try again later', 
        error: true 
      };
    }

    // Then check if bank service is up (required for balance check)
    const bankCheck = await checkService(apiBaseUrlBank);
    if (!bankCheck) {
      return { 
        message: 'Bank service is down, cannot verify balance', 
        error: true 
      };
    }

    const response = await fetch(`${apiBaseUrlStock}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      throw new Error('Stock purchase failed');
    }
    return response.json();
  } catch (error) {
    console.error('Stock purchase error:', error);
    return { 
      message: 'Stock service is unavailable', 
      error: true,
      serviceDown: true 
    };
  }
};
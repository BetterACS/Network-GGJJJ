const apiBaseUrlAuth = 'http://localhost:3001';
const apiBaseUrlBank = 'http://localhost:3002';
const apiBaseUrlStock = 'http://localhost:3003';

export const authenticate = async (username, password) => {
  try {
    const response = await fetch(`${apiBaseUrlAuth}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        message: data.message || 'Invalid username or password',
        error: true,
        authFailed: true
      };
    }

    return {
      ...data,
      error: false,
      authFailed: false
    };
  } catch (error) {
    console.error('Auth error:', error);
    return { 
      message: 'Authentication service is unavailable', 
      error: true,
      serviceDown: true 
    };
  }
};


const withdraw = async (amount, user) => {
  try {
    const authCheck = await checkService(apiBaseUrlAuth);
    if (!authCheck) {
      return { 
        message: 'Authentication service is down, please try again later', 
        error: true 
      };
    }

    const response = await fetch(`${apiBaseUrlBank}/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, user }),
    });

    if (!response.ok) {
      throw new Error('Withdrawal failed');
    }

    return response.json();
  } catch (error) {
    console.error('Withdrawal error:', error);
    return { 
      message: 'Bank service is unavailable', 
      error: true,
      serviceDown: true 
    };
  }
}

export const deposit = async (amount, user) => {
  try {
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
      body: JSON.stringify({ amount, user }),
    });

    if (!response.ok) {
      throw new Error('Deposit failed');
    }

    console.log("response",response);
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

export const getBalance = async (user) => {
  try {
    const response = await fetch(`${apiBaseUrlBank}/balance?user=${encodeURIComponent(user)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Unable to fetch balance');
    }
    return response.json();
  } catch (error) {
    console.error('Balance fetch error:', error);
    return { 
      message: 'Bank service is unavailable', 
      error: true,
      serviceDown: true 
    };
  }
};

export const buyStock = async (user, stockPrice, balance) => {
  try {
    const authCheck = await checkService(apiBaseUrlAuth);
    if (!authCheck) {
      return { 
        message: 'Authentication service is down, please try again later', 
        error: true 
      };
    }

    

    const response = await fetch(`${apiBaseUrlStock}/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockPrice, balance }),
    });

    if (response.ok) {
      await withdraw(Number(stockPrice),user);
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

const checkService = async (url) => {
  try {
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error(`Service at ${url} is down:`, error);
    return false;
  }
};

export const checkServices = async () => {
  try {
    const [authCheck, bankCheck, stockCheck] = await Promise.all([
      checkService(apiBaseUrlAuth),
      checkService(apiBaseUrlBank),
      checkService(apiBaseUrlStock)
    ]);
    return {
      auth: authCheck,
      bank: bankCheck,
      stock: stockCheck
    };
  } catch (error) {
    console.error('Error checking services:', error);
    return {
      auth: false,
      bank: false,
      stock: false
    };
  }
};


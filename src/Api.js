const apiBaseUrl = 'http://host.docker.internal'; // For Docker on Mac/Windows

export const authenticate = async (username, password) => {
  const response = await fetch(`${apiBaseUrl}:3001/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const deposit = async (amount) => {
  const response = await fetch(`${apiBaseUrl}:3002/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return response.json();
};

export const buyStock = async (amount) => {
  const response = await fetch(`${apiBaseUrl}:3003/buy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return response.json();
};

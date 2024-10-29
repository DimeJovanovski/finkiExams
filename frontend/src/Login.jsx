import React, { useState } from 'react';
import { login } from './api/api'; // Make sure you have a login function in your api.js
import { useNavigate } from 'react-router-dom';

function Login({ setAuthenticated, onRegisterClick }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigating programmatically

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await login(credentials);
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('role', response.data.role); // Store the user role
        console.log('Role: ', response.data.role);
        console.log('Token stored:', response.data.jwt);
        setAuthenticated(true);
        navigate('/');
    } catch (error) {
        setError('Invalid username or password');
        console.error("Login failed:", error);
    }
  };

  // Navigate to register handler
  const navigateToRegister = () => {
    onRegisterClick();
    navigate('/register');
  };



  return (
    <div className="login-container">
      <h2>Најава</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <button type="submit">Најави се</button>
      </form>
      <p>
        Немате корисничка сметка?
        <span onClick={navigateToRegister} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
          Регистрација
        </span>
      </p>
    </div>
  );
}

export default Login;

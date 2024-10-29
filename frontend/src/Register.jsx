import React, { useState } from 'react';
import { register } from './api/api'; // Make sure you have a register function in your api.js
import { useNavigate } from 'react-router-dom';

function Register({ onBack }) {
  const [userInfo, setUserInfo] = useState({ username: '', password: '', role: 'USER' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // For navigating programmatically

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(userInfo); // Ensure you have the register function in api.js
      setMessage('Успешна регистрација на нов корисник');
      setUserInfo({ username: '', password: '', role: 'USER' }); // Reset form
    } catch (error) {
      setMessage('Неуспешна регистрација: ' + error.response.data);
      console.error("Неуспешна регистрација: ", error);
    }
    navigate('/login');
  };

  // Navigate to login handler
  const navigateToLogin = () => {
    onBack();
    navigate('/login');
  };

  return (
    <div className="register-container">
      <h2>Регистрација</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          value={userInfo.username}
          onChange={handleInputChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={userInfo.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <input type="hidden" name="role" value={userInfo.role} />
        <button type="submit">Регистрирај се</button>
      </form>
      <p>
        Веќе имате корисничка сметка? 
        <span onClick={navigateToLogin} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
          Најава
        </span>
      </p>
    </div>
  );
}

export default Register;

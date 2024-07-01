import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://quotes-for-you-a.vercel.app/forgot-password', { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
      navigate(`/reset-password/${response.data.resetToken}`); // Redirect to reset page with token
    } catch (error) {
      console.error('Error sending password reset request:', error);
      setMessage('Failed to send password reset request.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;

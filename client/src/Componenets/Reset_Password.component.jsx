import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();

  console.log('ResetPassword component rendered with token:', token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    console.log('Submitting password reset request with token:', token);
    try {
      const response = await axios.post(`https://quotes-for-you-a.vercel.app/reset-password/${token}`, { password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Password reset response:', response.data);
      setMessage('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to reset password');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;

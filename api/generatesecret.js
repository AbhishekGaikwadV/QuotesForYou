const jwt = require('jsonwebtoken');

const generateResetPasswordToken = (userId) => {
  const payload = { _id: userId };
  const secret = 'your_reset_password_secret'; // Replace with your secret key
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
};

// // Example usage:
// const userId = '664c6e88149642c1208c8adf'; // Replace with actual user ID
// const resetToken = generateResetPasswordToken(userId);
// console.log('Reset Password Token:', resetToken);

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'shopez_secret_key_987654321',
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;

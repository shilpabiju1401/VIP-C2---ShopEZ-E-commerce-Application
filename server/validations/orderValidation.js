const { body } = require('express-validator');

const orderValidationRules = [
  body('customerName')
    .notEmpty().withMessage('Customer name is required')
    .trim(),
  body('email')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .trim(),
  body('address.street')
    .notEmpty().withMessage('Street address is required')
    .trim(),
  body('address.city')
    .notEmpty().withMessage('City is required')
    .trim(),
  body('address.state')
    .notEmpty().withMessage('State is required')
    .trim(),
  body('address.zipCode')
    .notEmpty().withMessage('Zip code is required')
    .trim(),
  body('address.country')
    .notEmpty().withMessage('Country is required')
    .trim(),
  body('paymentMethod')
    .optional()
    .isIn(['COD', 'Card']).withMessage('Payment method must be COD or Card')
];

module.exports = {
  orderValidationRules
};

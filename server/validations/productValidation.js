const { body } = require('express-validator');

const productValidationRules = [
  body('title')
    .notEmpty().withMessage('Product title is required')
    .trim(),
  body('description')
    .notEmpty().withMessage('Product description is required')
    .trim(),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
  body('category')
    .isMongoId().withMessage('Invalid category ID'),
  body('brand')
    .notEmpty().withMessage('Brand name is required')
    .trim(),
  body('stock')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array of image strings'),
  body('sizes')
    .optional()
    .isArray().withMessage('Sizes must be an array of strings')
];

module.exports = {
  productValidationRules
};

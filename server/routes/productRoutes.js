const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { productValidationRules } = require('../validations/productValidation');
const validate = require('../middleware/validationMiddleware');

router
  .route('/')
  .get(getProducts)
  .post(protect, admin, productValidationRules, validate, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, productValidationRules, validate, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/review').post(protect, addProductReview);

module.exports = router;

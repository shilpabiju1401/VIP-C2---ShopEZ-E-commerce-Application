const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { orderValidationRules } = require('../validations/orderValidation');
const validate = require('../middleware/validationMiddleware');

router
  .route('/')
  .post(protect, orderValidationRules, validate, createOrder)
  .get(protect, getMyOrders);

router.route('/all').get(protect, admin, getAllOrders);

router.route('/:id').put(protect, admin, updateOrderStatus);

module.exports = router;

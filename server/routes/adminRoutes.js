const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAdminSettings,
  updateAdminSettings
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/dashboard').get(protect, admin, getDashboardStats);
router
  .route('/settings')
  .get(getAdminSettings)
  .put(protect, admin, updateAdminSettings);

module.exports = router;

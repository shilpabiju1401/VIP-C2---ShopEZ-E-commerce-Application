const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const AdminSetting = require('../models/AdminSetting');

// @desc    Get dashboard analytics metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Counts
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // 2. Revenue Calculations (Excluding Cancelled orders)
    const completedOrders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // 3. Monthly Sales Chart Data (last 6 months)
    const monthlySales = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Aggregate sales by month (simple JS logic for robustness)
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const monthName = months[monthIndex];

      const startOfMonth = new Date(year, monthIndex, 1);
      const endOfMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59);

      const monthOrders = await Order.find({
        orderDate: { $gte: startOfMonth, $lte: endOfMonth },
        orderStatus: { $ne: 'Cancelled' }
      });

      const salesSum = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      monthlySales.push({
        month: `${monthName} ${year}`,
        sales: parseFloat(salesSum.toFixed(2)),
        ordersCount: monthOrders.length
      });
    }

    // 4. Products per Category Distribution (for pie/doughnut charts)
    const categorySales = [];
    const categories = await Category.find({});
    for (const cat of categories) {
      const productCount = await Product.countDocuments({ category: cat._id });
      categorySales.push({
        categoryName: cat.name,
        count: productCount
      });
    }

    // 5. Recent Orders (last 5)
    const recentOrders = await Order.find({})
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        totalUsers
      },
      monthlySales,
      categorySales,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin settings (announcements, banners)
// @route   GET /api/admin/settings
// @access  Public
const getAdminSettings = async (req, res) => {
  try {
    let settings = await AdminSetting.findOne({});
    if (!settings) {
      // Create default mock settings if none exist
      settings = await AdminSetting.create({
        bannerImages: [
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1441984969893-c53b1fc965db?auto=format&fit=crop&w=1200&q=80'
        ],
        announcements: [
          '⚡ Grand Launch Offer: Use code SHOPEZ20 for 20% off all fashion categories!',
          '🚚 Free delivery on all COD and Card orders above $50!'
        ]
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin settings (announcements, banners)
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateAdminSettings = async (req, res) => {
  const { bannerImages, announcements } = req.body;
  try {
    let settings = await AdminSetting.findOne({});
    if (!settings) {
      settings = new AdminSetting({});
    }

    settings.bannerImages = bannerImages || settings.bannerImages;
    settings.announcements = announcements || settings.announcements;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAdminSettings,
  updateAdminSettings
};

const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { customerName, email, phone, address, paymentMethod } = req.body;

  try {
    // 1. Get user cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const orderProducts = [];
    let totalAmount = 0;

    // 2. Validate stock and calculate prices
    for (const item of cart.items) {
      const product = item.productId;
      if (!product) {
        return res.status(404).json({ message: 'One of the products in your cart no longer exists' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: "${product.title}". Only ${product.stock} units left.`
        });
      }

      // Compute discounted price
      const price = product.price;
      const discount = product.discount || 0;
      const finalPrice = parseFloat((price - (price * (discount / 100))).toFixed(2));

      orderProducts.push({
        productId: product._id,
        title: product.title,
        price: finalPrice,
        quantity: item.quantity,
        size: item.size || ''
      });

      totalAmount += finalPrice * item.quantity;
    }

    // 3. Deduct stock from products
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      product.stock -= item.quantity;
      await product.save();
    }

    // 4. Determine initial payment status
    // For mock Card checkout, we simulate instant success. For COD it's Pending.
    const paymentStatus = paymentMethod === 'Card' ? 'Paid' : 'Pending';

    // 5. Create order document
    const order = new Order({
      userId: req.user._id,
      customerName,
      email,
      phone,
      address,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus,
      products: orderProducts,
      totalAmount: parseFloat(totalAmount.toFixed(2))
    });

    const createdOrder = await order.save();

    // 6. Clear cart items
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status or payment status (Admin only)
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // If order is cancelled, return the stock back to products
      if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
        for (const item of order.products) {
          const product = await Product.findById(item.productId);
          if (product) {
            product.stock += item.quantity;
            await product.save();
          }
        }
      }

      order.orderStatus = orderStatus || order.orderStatus;
      order.paymentStatus = paymentStatus || order.paymentStatus;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};

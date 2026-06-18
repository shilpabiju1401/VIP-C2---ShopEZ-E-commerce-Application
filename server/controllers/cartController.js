const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to calculate total price of a populated cart
const calculateCartTotal = async (cart) => {
  let total = 0;
  // Populate cart items to get pricing
  const populated = await cart.populate('items.productId', 'price discount');
  for (const item of populated.items) {
    if (item.productId) {
      const price = item.productId.price;
      const discount = item.productId.discount || 0;
      const finalPrice = price - (price * (discount / 100));
      total += finalPrice * item.quantity;
    }
  }
  return parseFloat(total.toFixed(2));
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items.productId',
      select: 'title price discount images brand stock'
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [], totalPrice: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or update item quantity in cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity, size } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [], totalPrice: 0 });
    }

    // Find if item already exists in cart with same size
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === (size || '')
    );

    if (itemIndex > -1) {
      // Overwrite/increment quantity
      cart.items[itemIndex].quantity = Number(quantity);
    } else {
      // Add new item
      cart.items.push({ productId, quantity: Number(quantity), size: size || '' });
    }

    // Recalculate price
    cart.totalPrice = await calculateCartTotal(cart);
    await cart.save();

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title price discount images brand stock'
    });

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const size = req.query.size || ''; // Support size differentiator if needed

  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter items
    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    // Recalculate price
    cart.totalPrice = await calculateCartTotal(cart);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.productId',
      select: 'title price discount images brand stock'
    });

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear active cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    } else {
      cart = await Cart.create({ userId: req.user._id, items: [], totalPrice: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};

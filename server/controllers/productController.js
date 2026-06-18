const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch products with search, filters, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 9;
    const page = Number(req.query.page) || 1;

    // Search query
    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};

    // Filter by Category Slug or Object ID
    let categoryQuery = {};
    if (req.query.category) {
      // Check if it's a valid MongoDB ID
      if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
        categoryQuery = { category: req.query.category };
      } else {
        // Assume slug and lookup category ID
        const categoryDoc = await Category.findOne({ slug: req.query.category });
        if (categoryDoc) {
          categoryQuery = { category: categoryDoc._id };
        } else {
          // Slug not found, match nothing
          categoryQuery = { category: null };
        }
      }
    }

    // Filter by Brand
    const brandQuery = req.query.brand ? { brand: req.query.brand } : {};

    // Filter by Price range
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Infinity;
    const priceQuery = { price: { $gte: minPrice, $lte: maxPrice } };

    // Filter by Featured
    const featuredQuery = req.query.featured === 'true' ? { featured: true } : {};

    // Combine all filters
    const filter = {
      ...keyword,
      ...categoryQuery,
      ...brandQuery,
      ...priceQuery,
      ...featuredQuery
    };

    // Sorting
    let sort = {};
    if (req.query.sortBy) {
      if (req.query.sortBy === 'priceAsc') {
        sort = { price: 1 };
      } else if (req.query.sortBy === 'priceDesc') {
        sort = { price: -1 };
      } else if (req.query.sortBy === 'ratings') {
        sort = { ratings: -1 };
      } else if (req.query.sortBy === 'newest') {
        sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 }; // default newest
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Get unique brand list for catalog filter sidebar
    const brands = await Product.distinct('brand');

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
      brands
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const {
    title,
    price,
    description,
    image,
    images,
    brand,
    category,
    stock,
    sizes,
    discount,
    featured
  } = req.body;

  try {
    // Make sure category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const product = new Product({
      title,
      price,
      description,
      brand,
      category,
      stock: stock || 0,
      images: images || (image ? [image] : []),
      sizes: sizes || [],
      discount: discount || 0,
      featured: featured || false,
      ratings: 5
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    title,
    price,
    description,
    images,
    brand,
    category,
    stock,
    sizes,
    discount,
    featured
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      if (category) {
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
          return res.status(400).json({ message: 'Category not found' });
        }
        product.category = category;
      }

      product.title = title || product.title;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.brand = brand || product.brand;
      product.stock = stock !== undefined ? stock : product.stock;
      product.sizes = sizes || product.sizes;
      product.discount = discount !== undefined ? discount : product.discount;
      product.featured = featured !== undefined ? featured : product.featured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/review
// @access  Private
const addProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        user: req.user._id,
        username: req.user.username,
        comment,
        rating: Number(rating)
      };

      product.reviews.push(review);
      product.calculateAverageRating();

      await product.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview
};

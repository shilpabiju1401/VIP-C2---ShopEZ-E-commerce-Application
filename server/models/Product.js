const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  ratings: {
    type: Number,
    default: 5
  },
  reviews: [ReviewSchema],
  images: [{
    type: String
  }],
  sizes: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically calculate average rating when reviews are added
ProductSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.ratings = 5;
  } else {
    const sum = this.reviews.reduce((acc, item) => item.rating + acc, 0);
    this.ratings = parseFloat((sum / this.reviews.length).toFixed(1));
  }
};

module.exports = mongoose.model('Product', ProductSchema);

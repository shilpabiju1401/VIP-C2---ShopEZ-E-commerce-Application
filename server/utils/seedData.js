const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const AdminSetting = require('../models/AdminSetting');
const connectDB = require('../config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing collections
    console.log('Clearing database collection data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await AdminSetting.deleteMany({});

    console.log('Inserting default users...');
    // Create Users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@shopez.com',
      password: 'admin123', // Will be hashed in Schema pre-save
      role: 'admin',
      phone: '123-456-7890'
    });

    const regularUser = await User.create({
      username: 'johndoe',
      email: 'john@shopez.com',
      password: 'password123', // Will be hashed in Schema pre-save
      role: 'user',
      phone: '987-654-3210'
    });

    console.log('Inserting default categories...');
    // Create Categories
    const categoriesData = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest premium gadgets, smartwatches, and headphones.',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Fashion & Style',
        slug: 'fashion',
        description: 'Modern clothing, designer shoes, and luxury wear.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Elegant home decor, lighting, and workspace gear.',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Sports & Wellness',
        slug: 'sports',
        description: 'High-performance fitness gear and training items.',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80'
      }
    ];

    const insertedCategories = await Category.insertMany(categoriesData);

    // Map categories by slug for product insertion
    const catMap = {};
    insertedCategories.forEach(cat => {
      catMap[cat.slug] = cat._id;
    });

    console.log('Inserting default products...');
    // Create Products
    const productsData = [
      {
        title: 'Acoustic PRO Wireless Earbuds',
        description: 'Experience studio-grade active noise-cancelling sound with up to 40 hours of playtime. Featuring modern Bluetooth 5.3 technology, IPX7 water resistance, and deep dynamic bass.',
        brand: 'Acoustic',
        price: 129.99,
        discount: 15,
        stock: 50,
        category: catMap['electronics'],
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80'
        ],
        sizes: [],
        featured: true,
        ratings: 4.8
      },
      {
        title: 'Chronos Smart Watch Series 7',
        description: 'Stay connected and track your health. Monitor heart rate, blood oxygen levels, sleep cycles, and daily workouts on a sleek 1.9-inch AMOLED always-on display.',
        brand: 'Chronos',
        price: 249.99,
        discount: 10,
        stock: 30,
        category: catMap['electronics'],
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80'
        ],
        sizes: [],
        featured: true,
        ratings: 4.6
      },
      {
        title: 'Nomad Premium Leather Jacket',
        description: 'Crafted from 100% genuine top-grain lambskin leather. Features multiple zippered utility pockets, comfortable premium polyester lining, and a classic vintage biker silhouette.',
        brand: 'Nomad',
        price: 189.99,
        discount: 20,
        stock: 15,
        category: catMap['fashion'],
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: true,
        ratings: 4.9
      },
      {
        title: 'Minimalist Leather Sneakers',
        description: 'Clean, versatile sneakers made from eco-friendly premium calfskin. Perfect for smart-casual wear, featuring durable rubber cup soles and memory foam cushioned insoles.',
        brand: 'Nomad',
        price: 99.99,
        discount: 0,
        stock: 25,
        category: catMap['fashion'],
        images: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'
        ],
        sizes: ['8', '9', '10', '11'],
        featured: false,
        ratings: 4.4
      },
      {
        title: 'Lumina Arc Table Desk Lamp',
        description: 'Contemporary arch desk lamp featuring custom color temperature controls, slide touch-dimming, and an integrated wireless charger base for smart smartphones.',
        brand: 'Lumina',
        price: 59.99,
        discount: 5,
        stock: 40,
        category: catMap['home-living'],
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'
        ],
        sizes: [],
        featured: true,
        ratings: 4.5
      },
      {
        title: 'Ceramic Stoneware Coffee Mug (Set of 2)',
        description: 'Handcrafted stoneware coffee cups with earthy organic glazes. Microwave and dishwasher safe, featuring ergonomic handles for a comfortable warm morning grip.',
        brand: 'Lumina',
        price: 34.99,
        discount: 0,
        stock: 60,
        category: catMap['home-living'],
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
        ],
        sizes: [],
        featured: false,
        ratings: 4.2
      },
      {
        title: 'Apex Eco Grip Yoga Mat',
        description: 'Made from 100% biodegradable eco-TPE material. Provides exceptional cushioning, double-sided non-slip traction surfaces, and a carrying strap included.',
        brand: 'Apex',
        price: 45.00,
        discount: 10,
        stock: 35,
        category: catMap['sports'],
        images: [
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80'
        ],
        sizes: [],
        featured: false,
        ratings: 4.7
      },
      {
        title: 'Hydra Vacuum Insulated Flask',
        description: 'Double-walled stainless steel construction keeps beverages cold for up to 24 hours or hot for up to 12. Leak-proof straw lid design, 32 oz capacity.',
        brand: 'Apex',
        price: 29.99,
        discount: 0,
        stock: 100,
        category: catMap['sports'],
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80'
        ],
        sizes: [],
        featured: true,
        ratings: 4.3
      }
    ];

    const insertedProducts = await Product.insertMany(productsData);

    console.log('Inserting default homepage settings...');
    // Create Settings
    await AdminSetting.create({
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

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

// Check if run directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;

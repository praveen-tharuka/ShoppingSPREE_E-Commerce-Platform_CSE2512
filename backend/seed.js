const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Connection Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create categories
    const electronics = new Category({
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    });

    const fashion = new Category({
      name: 'Fashion',
      description: 'Clothing, shoes, and accessories',
      image: 'https://images.unsplash.com/photo-1441984904556-0ac8ce9b4853?w=400',
    });

    const home = new Category({
      name: 'Home & Garden',
      description: 'Home decor and garden products',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400',
    });

    const books = new Category({
      name: 'Books',
      description: 'Physical and educational books',
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
    });

    await Category.insertMany([electronics, fashion, home, books]);
    console.log('Categories created');

    // Create products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 79.99,
        originalPrice: 99.99,
        category: electronics._id,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        stock: 50,
        sku: 'WH-001',
        rating: 4.5,
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with fitness tracking',
        price: 199.99,
        originalPrice: 249.99,
        category: electronics._id,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        stock: 30,
        sku: 'SW-001',
        rating: 4.2,
      },
      {
        name: 'USB-C Cable',
        description: 'Durable USB-C charging cable, 2-pack',
        price: 12.99,
        category: electronics._id,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
        stock: 100,
        sku: 'UC-001',
        rating: 4.7,
      },
      {
        name: 'Men\'s T-Shirt',
        description: 'Comfortable cotton t-shirt, multiple colors available',
        price: 24.99,
        originalPrice: 34.99,
        category: fashion._id,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        stock: 75,
        sku: 'TS-001',
        rating: 4.3,
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes with cushioning support',
        price: 89.99,
        originalPrice: 129.99,
        category: fashion._id,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        stock: 45,
        sku: 'RS-001',
        rating: 4.6,
      },
      {
        name: 'Denim Jeans',
        description: 'Classic blue denim jeans, various sizes',
        price: 54.99,
        originalPrice: 79.99,
        category: fashion._id,
        image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400',
        stock: 60,
        sku: 'DJ-001',
        rating: 4.4,
      },
      {
        name: 'Decorative Pillow',
        description: 'Soft decorative pillow for your home',
        price: 29.99,
        category: home._id,
        image: 'https://images.unsplash.com/photo-1595692759962-efc3b96d64f9?w=400',
        stock: 40,
        sku: 'DP-001',
        rating: 4.1,
      },
      {
        name: 'Table Lamp',
        description: 'Modern LED table lamp with adjustable brightness',
        price: 44.99,
        originalPrice: 59.99,
        category: home._id,
        image: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400',
        stock: 35,
        sku: 'TL-001',
        rating: 4.5,
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with programmable timer',
        price: 69.99,
        originalPrice: 89.99,
        category: home._id,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400',
        stock: 25,
        sku: 'CM-001',
        rating: 4.3,
      },
      {
        name: 'JavaScript Guide',
        description: 'Comprehensive guide to modern JavaScript programming',
        price: 34.99,
        originalPrice: 49.99,
        category: books._id,
        image: 'https://images.unsplash.com/photo-1543002588-d83cedbc4d60?w=400',
        stock: 55,
        sku: 'BK-001',
        rating: 4.7,
      },
      {
        name: 'React Mastery',
        description: 'Learn React from basics to advanced concepts',
        price: 39.99,
        originalPrice: 54.99,
        category: books._id,
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        stock: 40,
        sku: 'BK-002',
        rating: 4.6,
      },
      {
        name: 'Web Design Principles',
        description: 'Essential principles for creating beautiful websites',
        price: 29.99,
        category: books._id,
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
        stock: 50,
        sku: 'BK-003',
        rating: 4.4,
      },
    ];

    await Product.insertMany(products);
    console.log('Products created');

    // Clear existing users before creating new ones
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create sample customer
    const customerUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
    });

    // Save users separately to trigger pre-save hook for password hashing
    await adminUser.save();
    await customerUser.save();
    console.log('Admin and customer users created');

    console.log('Database seeded successfully!');
    console.log('Admin Email: admin@example.com, Password: admin123');
    console.log('Customer Email: john@example.com, Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();

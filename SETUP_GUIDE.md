# E-Commerce Platform Setup Guide

## Project Overview
This is a full-stack e-commerce platform with user authentication, product management, shopping cart, orders, and admin dashboard.

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Edit `.env` file (already created):
   ```
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
   PORT=5000
   NODE_ENV=development
   ```

4. **Seed Database** (Optional - populates sample data)
   ```bash
   npm run seed
   ```
   Test Credentials:
   - Admin: `admin@example.com` / `admin123`
   - Customer: `john@example.com` / `password123`

5. **Start Backend Server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173` (or next available port)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `PUT /api/users/change-password` - Change password (protected)

### Products
- `GET /api/products` - Get all products (with filtering, sorting, pagination)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `POST /api/products/:id/reviews` - Add product review (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:productId` - Update item quantity (protected)
- `DELETE /api/cart/:productId` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `POST /api/orders` - Create new order (protected)
- `PUT /api/orders/:id` - Update order status (admin only)
- `DELETE /api/orders/:id` - Cancel order (protected)
- `GET /api/orders/admin/all` - Get all orders (admin only)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Deactivate user (admin only)

## Key Features Implemented

### User Management
✅ User Registration & Login
✅ Profile Management (name, email, phone, address)
✅ Password Change/Reset
✅ Role-based Access Control (Customer/Admin)
✅ JWT Authentication with token expiration

### Product Management
✅ Browse products with pagination
✅ Search and filter products by category
✅ Sort by price, rating, newest
✅ Product details with images
✅ Product reviews and ratings system
✅ Admin: Create, edit, delete products
✅ Inventory management

### Shopping Cart
✅ Add/remove products from cart
✅ Adjust quantities
✅ View cart total
✅ Persistent cart management

### Checkout & Orders
✅ Shipping address collection
✅ Order creation with automatic inventory reduction
✅ Order status tracking
✅ Order history for customers
✅ Admin: Order management and status updates
✅ Order cancellation (pending orders only)

### Admin Dashboard
✅ Sales statistics and metrics
✅ Order status overview
✅ User management (role assignment)
✅ Product inventory management
✅ Order tracking and updates
✅ User activation/deactivation

### Security Features
✅ Password hashing with bcryptjs
✅ JWT authentication with 30-day expiration
✅ Protected routes (frontend & backend)
✅ Role-based authorization
✅ Input validation on both frontend & backend
✅ CORS protection
✅ Secure error handling (no sensitive info leaked)
✅ SQL injection prevention (MongoDB)

## Default Admin & Test Account

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Test Customer Account:**
- Email: `john@example.com`
- Password: `password123`

## File Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── middleware/
│   └── auth.js              # JWT & role-based middleware
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── categories.js
│   ├── cart.js
│   ├── orders.js
│   └── admin.js
├── server.js
├── seed.js
└── .env

frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   ├── Profile.jsx
│   │   ├── Dashboard.jsx
│   │   └── Admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       ├── AdminOrders.jsx
│   │       └── AdminUsers.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
└── index.html
```

## Styling
- **Tailwind CSS** for utility-first styling
- Consistent color scheme (sky blue primary)
- Responsive design for mobile, tablet, desktop
- Modern UI components with hover effects

## Payment Integration
Currently using mock payment for testing. To integrate real payment:
1. Stripe: Install `stripe` package and update checkout
2. PayPal: Install PayPal SDK and add payment handling
3. Update order payment status accordingly

## Deployment Checklist

Before deploying to production:
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update `MONGODB_URI` to production database
- [ ] Set `NODE_ENV=production`
- [ ] Remove seed data from production
- [ ] Configure CORS with actual frontend domain
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure proper error logging
- [ ] Test payment processing
- [ ] Set up email notifications (optional)

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database permissions

**Port Already in Use:**
- Backend: Change PORT in `.env`
- Frontend: Vite will auto-increment port

**CORS Errors:**
- Verify backend CORS settings
- Check frontend API base URL

**Authentication Issues:**
- Clear localStorage and browser cache
- Verify JWT_SECRET matches
- Check token expiration

## Future Enhancements

- [ ] Email notifications (registration, order confirmation, shipping)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Advanced analytics
- [ ] Discount codes/coupons
- [ ] Multiple payment methods
- [ ] Two-factor authentication
- [ ] Product variants (size, color)
- [ ] File upload for product images
- [ ] Email verification for signup
- [ ] Password reset email link

## Support
For issues or questions, check the console logs and ensure:
1. Backend server is running
2. MongoDB is connected
3. Frontend is pointing to correct API URL
4. All dependencies are installed

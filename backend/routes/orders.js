const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post(
  '/',
  auth,
  [
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('shippingAddress.name').notEmpty().withMessage('Name is required'),
    body('shippingAddress.street').notEmpty().withMessage('Street is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get cart
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const { shippingAddress, paymentMethod = 'mock' } = req.body;

      // Prepare order items
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      // Calculate totals
      const totalPrice = cart.totalPrice;
      const shippingCost = totalPrice > 100 ? 0 : 10;
      const tax = parseFloat((totalPrice * 0.1).toFixed(2));
      const finalTotal = parseFloat((totalPrice + shippingCost + tax).toFixed(2));

      // Create order
      const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice: finalTotal,
        shippingCost,
        tax,
        orderStatus: 'pending',
        paymentStatus: 'completed', // Mock payment
      });

      await order.save();

      // Reduce product stock
      for (let item of cart.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        }
      }

      // Clear cart
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });

      await order.populate('items.product', 'name price image');

      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error creating order' });
    }
  }
);

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id', [auth, admin], [
  body('orderStatus').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid order status'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = Date.now();

    await order.save();
    await order.populate('items.product', 'name price image');

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error updating order' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel order (Only for pending orders)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Only allow cancellation of pending orders
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending orders' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error cancelling order' });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/admin/all', [auth, admin], async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.orderStatus === 'pending').length,
      processingOrders: orders.filter((o) => o.orderStatus === 'processing').length,
      shippedOrders: orders.filter((o) => o.orderStatus === 'shipped').length,
      deliveredOrders: orders.filter((o) => o.orderStatus === 'delivered').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
    };

    res.json({ orders, stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// @route   GET /api/categories/:slug
// @desc    Get category by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching category' });
  }
});

// @route   POST /api/categories
// @desc    Create a new category (Admin only)
// @access  Private/Admin
router.post(
  '/',
  [auth, admin],
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('description').trim().optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, image } = req.body;

      // Check if category exists
      const categoryExists = await Category.findOne({ name });
      if (categoryExists) {
        return res.status(400).json({ message: 'Category already exists' });
      }

      const category = new Category({
        name,
        description,
        image: image || 'https://via.placeholder.com/300',
      });

      await category.save();
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error creating category' });
    }
  }
);

// @route   PUT /api/categories/:id
// @desc    Update a category (Admin only)
// @access  Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, image, isActive } = req.body;

    if (name) {
      const exists = await Category.findOne({ name, _id: { $ne: req.params.id } });
      if (exists) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
      category.name = name;
    }
    if (description) category.description = description;
    if (image) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).json({ message: 'Server error updating category' });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).json({ message: 'Server error deleting category' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { mockCategories } = require('../data/mockData');

// Use mock categories from data file
const categories = mockCategories.map(cat => ({
  id: cat._id,
  name: cat.name,
  description: cat.description,
  productCount: cat.productCount,
  status: cat.status,
  createdAt: cat.createdAt.toISOString().split('T')[0],
  color: `bg-${['blue', 'purple', 'green', 'red', 'orange', 'pink'][Math.floor(Math.random() * 6)]}-500`
}));

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let filteredCategories = [...categories];

    // Filter by status
    if (status && status !== 'all') {
      filteredCategories = filteredCategories.filter(cat => cat.status === status);
    }

    // Search by name or description
    if (search) {
      filteredCategories = filteredCategories.filter(cat => 
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      count: filteredCategories.length,
      categories: filteredCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = categories.find(cat => cat.id === parseInt(req.params.id));

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/categories
// @desc    Create category
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, status = 'active' } = req.body;

    // Check if category already exists
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    // Generate unique ID
    const maxId = categories.length > 0 ? Math.max(...categories.map(cat => cat.id)) : 0;
    
    const newCategory = {
      id: maxId + 1,
      name,
      description,
      productCount: 0,
      status,
      createdAt: new Date().toISOString().split('T')[0],
      color: `bg-${['blue', 'purple', 'green', 'red', 'orange', 'pink'][Math.floor(Math.random() * 6)]}-500`
    };

    categories.push(newCategory);

    res.status(201).json({
      success: true,
      category: newCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const categoryIndex = categories.findIndex(cat => cat.id === parseInt(req.params.id));

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const { name, description, status } = req.body;

    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name: name || categories[categoryIndex].name,
      description: description || categories[categoryIndex].description,
      status: status || categories[categoryIndex].status,
    };

    res.json({
      success: true,
      category: categories[categoryIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const categoryIndex = categories.findIndex(cat => cat.id === parseInt(req.params.id));

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const deletedCategory = categories.splice(categoryIndex, 1)[0];

    res.json({
      success: true,
      message: 'Category deleted successfully',
      category: deletedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

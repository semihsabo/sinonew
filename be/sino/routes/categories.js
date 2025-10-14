const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Mock categories data
const categories = [
  {
    id: 1,
    name: 'Fitness Ekipmanları',
    description: 'Genel fitness ve antrenman ekipmanları',
    productCount: 15,
    status: 'active',
    createdAt: '2024-01-15',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    name: 'Yoga Ürünleri',
    description: 'Yoga matları, blokları ve aksesuarları',
    productCount: 8,
    status: 'active',
    createdAt: '2024-01-20',
    color: 'bg-purple-500',
  },
  {
    id: 3,
    name: 'Protein ve Beslenme',
    description: 'Protein tozları, vitaminler ve besin takviyeleri',
    productCount: 12,
    status: 'active',
    createdAt: '2024-02-01',
    color: 'bg-green-500',
  },
  {
    id: 4,
    name: 'Kardiyo Ekipmanları',
    description: 'Koşu bandları, bisikletler ve kardiyo makineleri',
    productCount: 6,
    status: 'active',
    createdAt: '2024-02-10',
    color: 'bg-red-500',
  },
  {
    id: 5,
    name: 'Ağırlık Antrenmanı',
    description: 'Dumbbelllar, barbelllar ve ağırlık ekipmanları',
    productCount: 20,
    status: 'active',
    createdAt: '2024-02-15',
    color: 'bg-orange-500',
  },
  {
    id: 6,
    name: 'Spor Giyim',
    description: 'Antrenman kıyafetleri ve spor ayakkabıları',
    productCount: 0,
    status: 'inactive',
    createdAt: '2024-03-01',
    color: 'bg-pink-500',
  },
];

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

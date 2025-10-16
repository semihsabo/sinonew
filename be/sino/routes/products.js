const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { mockProducts } = require('../data/mockData');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort, status } = req.query;
    
    let products = [...mockProducts];

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by status
    if (status && status !== 'all') {
      products = products.filter(product => product.status === status);
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter(product => product.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(product => product.price <= Number(maxPrice));
    }

    // Search by name or description
    if (search) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = mockProducts.find(p => p._id === req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/products
// @desc    Create product
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.array('images', 5), async (req, res) => {
  try {
    const productData = req.body;

    // Add uploaded images
    if (req.files) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let product = null;
    
    // Try to find product in database first (only if it looks like a valid ObjectId)
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        product = await Product.findById(req.params.id);
      } catch (dbError) {
        // Ignore database errors for non-ObjectId strings
        console.log('Database query failed for ID:', req.params.id);
      }
    }

    // If not found in database, check mock data
    if (!product) {
      const { mockProducts } = require('../data/mockData');
      const mockProduct = mockProducts.find(p => p._id === req.params.id);
      
      if (mockProduct) {
        // Mock delete - just return success
        return res.json({
          success: true,
          message: 'Product deleted (mock)'
        });
      }
      
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;



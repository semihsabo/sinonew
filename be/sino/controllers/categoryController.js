const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const { status, search } = req.query;
  
  let query = {};
  
  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }
  
  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  const categories = await Category.find(query).sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: categories.length,
    categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }
  
  res.json({
    success: true,
    category
  });
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, status = 'active' } = req.body;
  
  // Check if category already exists
  const existingCategory = await Category.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') }
  });
  
  if (existingCategory) {
    return next(new ErrorResponse('Category already exists', 400));
  }
  
  const category = await Category.create({
    name,
    description,
    status
  });
  
  res.status(201).json({
    success: true,
    category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }
  
  category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  res.json({
    success: true,
    category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }
  
  await Category.findByIdAndDelete(req.params.id);
  
  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});

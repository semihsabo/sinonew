const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: updatedUser
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/users/address
// @desc    Add address
// @access  Private
router.post('/address', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.address.push(req.body);
      await user.save();

      res.json({
        success: true,
        user
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/users/address/:addressId
// @desc    Update address
// @access  Private
router.put('/address/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      const address = user.address.id(req.params.addressId);
      if (address) {
        Object.assign(address, req.body);
        await user.save();

        res.json({
          success: true,
          user
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/users/address/:addressId
// @desc    Delete address
// @access  Private
router.delete('/address/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.address = user.address.filter(addr => addr._id.toString() !== req.params.addressId);
      await user.save();

      res.json({
        success: true,
        user
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/users/favorites/:productId
// @desc    Add product to favorites
// @access  Private
router.post('/favorites/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      if (!user.favorites.includes(req.params.productId)) {
        user.favorites.push(req.params.productId);
        await user.save();
      }

      res.json({
        success: true,
        favorites: user.favorites
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/users/favorites/:productId
// @desc    Remove product from favorites
// @access  Private
router.delete('/favorites/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.favorites = user.favorites.filter(id => id.toString() !== req.params.productId);
      await user.save();

      res.json({
        success: true,
        favorites: user.favorites
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Try to find user in database first
    let user = await User.findById(req.params.id);

    // If not found in database, check mock users
    if (!user) {
      // Mock users for demo
      const mockUsers = [
        { id: 1, email: 'admin@liftpick.com', name: 'Admin User', role: 'admin' },
        { id: 2, email: 'user@liftpick.com', name: 'Test User', role: 'user' },
        { id: 3, email: 'test@test.com', name: 'Demo User', role: 'user' }
      ];
      
      const mockUser = mockUsers.find(u => u.id === parseInt(req.params.id) || u.id === req.params.id);
      
      if (mockUser) {
        // Mock delete - just return success
        return res.json({
          success: true,
          message: 'User deleted (mock)'
        });
      }
      
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;



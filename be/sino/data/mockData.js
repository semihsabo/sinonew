// Mock data for development
const mockProducts = [
  {
    _id: '1',
    name: 'Designer Leather Handbag',
    description: 'Premium quality leather handbag with modern design',
    price: 459,
    originalPrice: 599,
    category: 'Fashion',
    stock: 15,
    images: ['/images/handbag1.jpg'],
    colors: ['Black', 'Brown', 'Tan'],
    sizes: ['One Size'],
    brand: 'LuxuryBrand',
    rating: 4.5,
    numReviews: 23,
    isFeatured: true,
    status: 'active',
    createdAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Hopena Shop Kişiye Özel Fotoğraf',
    description: 'Custom photo printing service for special memories',
    price: 283.5,
    originalPrice: 315,
    category: 'Photography',
    stock: 8,
    images: ['/images/photo1.jpg'],
    colors: ['Colorful'],
    sizes: ['A4', 'A3'],
    brand: 'HopenaShop',
    rating: 4.2,
    numReviews: 15,
    isFeatured: false,
    status: 'active',
    createdAt: new Date('2024-01-20')
  },
  {
    _id: '3',
    name: 'Luxury Face Cream',
    description: 'Anti-aging luxury face cream for all skin types',
    price: 125,
    originalPrice: 199,
    category: 'Beauty',
    stock: 12,
    images: ['/images/cream1.jpg'],
    colors: ['White'],
    sizes: ['50ml', '100ml'],
    brand: 'BeautyLux',
    rating: 4.8,
    numReviews: 45,
    isFeatured: true,
    status: 'active',
    createdAt: new Date('2024-02-01')
  },
  {
    _id: '4',
    name: 'Sport Running Shoes',
    description: 'High-performance running shoes for athletes',
    price: 299,
    originalPrice: 399,
    category: 'Sports',
    stock: 6,
    images: ['/images/shoes1.jpg'],
    colors: ['Black', 'White', 'Red'],
    sizes: ['38', '39', '40', '41', '42', '43'],
    brand: 'SportMax',
    rating: 4.6,
    numReviews: 32,
    isFeatured: false,
    status: 'active',
    createdAt: new Date('2024-02-10')
  },
  {
    _id: '5',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    price: 199,
    originalPrice: 299,
    category: 'Electronics',
    stock: 20,
    images: ['/images/headphones1.jpg'],
    colors: ['Black', 'White', 'Blue'],
    sizes: ['One Size'],
    brand: 'AudioTech',
    rating: 4.7,
    numReviews: 67,
    isFeatured: true,
    status: 'active',
    createdAt: new Date('2024-02-15')
  },
  {
    _id: '6',
    name: 'Yoga Mat Premium',
    description: 'Non-slip premium yoga mat for all yoga practices',
    price: 89,
    originalPrice: 129,
    category: 'Sports',
    stock: 25,
    images: ['/images/yogamat1.jpg'],
    colors: ['Purple', 'Blue', 'Pink'],
    sizes: ['Standard'],
    brand: 'YogaLife',
    rating: 4.4,
    numReviews: 28,
    isFeatured: false,
    status: 'active',
    createdAt: new Date('2024-03-01')
  }
];

const mockCategories = [
  {
    _id: '1',
    name: 'Fashion',
    description: 'Clothing and fashion accessories',
    productCount: 1,
    status: 'active',
    createdAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Photography',
    description: 'Photography equipment and services',
    productCount: 1,
    status: 'active',
    createdAt: new Date('2024-01-20')
  },
  {
    _id: '3',
    name: 'Beauty',
    description: 'Beauty and skincare products',
    productCount: 1,
    status: 'active',
    createdAt: new Date('2024-02-01')
  },
  {
    _id: '4',
    name: 'Sports',
    description: 'Sports equipment and accessories',
    productCount: 2,
    status: 'active',
    createdAt: new Date('2024-02-10')
  },
  {
    _id: '5',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    productCount: 1,
    status: 'active',
    createdAt: new Date('2024-02-15')
  }
];

module.exports = {
  mockProducts,
  mockCategories
};

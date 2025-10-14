const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jcres');
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Seed categories
    const categories = [
      {
        name: 'Fitness Ekipmanları',
        description: 'Genel fitness ve antrenman ekipmanları',
        status: 'active',
        productCount: 15
      },
      {
        name: 'Yoga Ürünleri',
        description: 'Yoga matları, blokları ve aksesuarları',
        status: 'active',
        productCount: 8
      },
      {
        name: 'Protein ve Beslenme',
        description: 'Protein tozları, vitaminler ve besin takviyeleri',
        status: 'active',
        productCount: 12
      },
      {
        name: 'Kardiyo Ekipmanları',
        description: 'Koşu bandları, bisikletler ve kardiyo makineleri',
        status: 'active',
        productCount: 6
      },
      {
        name: 'Ağırlık Antrenmanı',
        description: 'Dumbbelllar, barbelllar ve ağırlık ekipmanları',
        status: 'active',
        productCount: 20
      },
      {
        name: 'Spor Giyim',
        description: 'Antrenman kıyafetleri ve spor ayakkabıları',
        status: 'inactive',
        productCount: 0
      }
    ];

    await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();

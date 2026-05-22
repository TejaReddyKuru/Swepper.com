require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Plan = require('./models/Plan');
const connectDB = require('./config/db');

connectDB();

const plans = [
  // Basic Plans
  {
    name: 'Basic Plan (1 BHK)',
    category: 'Basic',
    description: 'Standard daily sweeping and mopping, dish washing, own liquids',
    price: 2299,
    bhkType: '1 BHK',
    frequency: 'Monthly',
    features: [
      'Floor cleaning and mopping',
      'Dishes washing',
      'Monthly two leaves for maid',
      'Monthly once full house cleaning',
      'Own liquids for cleaning',
    ],
  },
  {
    name: 'Basic Plan (2 BHK)',
    category: 'Basic',
    description: 'Standard daily sweeping and mopping, dish washing, own liquids',
    price: 2899,
    bhkType: '2 BHK',
    frequency: 'Monthly',
    features: [
      'Floor cleaning and mopping',
      'Dishes washing',
      'Monthly two leaves for maid',
      'Monthly once full house cleaning',
      'Own liquids for cleaning',
    ],
  },
  {
    name: 'Basic Plan (3 BHK)',
    category: 'Basic',
    description: 'Standard daily sweeping and mopping, dish washing, own liquids',
    price: 3399,
    bhkType: '3 BHK',
    frequency: 'Monthly',
    features: [
      'Floor cleaning and mopping',
      'Dishes washing',
      'Monthly two leaves for maid',
      'Monthly once full house cleaning',
      'Own liquids for cleaning',
    ],
  },
  // Premium Plans
  {
    name: 'Premium Plan (1 BHK)',
    category: 'Premium',
    description: 'Daily sweeping, mopping, dishes, no maid leaves, twice washrooms, twice full clean',
    price: 2799,
    bhkType: '1 BHK',
    frequency: 'Monthly',
    features: [
      'No holiday for maid',
      'Monthly twice washroom cleaning',
      'Monthly twice full house cleaning',
      'Own liquids for cleaning',
    ],
  },
  {
    name: 'Premium Plan (2 BHK)',
    category: 'Premium',
    description: 'Daily sweeping, mopping, dishes, no maid leaves, twice washrooms, twice full clean',
    price: 3499,
    bhkType: '2 BHK',
    frequency: 'Monthly',
    features: [
      'No holiday for maid',
      'Monthly twice washroom cleaning',
      'Monthly twice full house cleaning',
      'Own liquids for cleaning',
    ],
  },
  {
    name: 'Premium Plan (3 BHK)',
    category: 'Premium',
    description: 'Daily sweeping, mopping, dishes, no maid leaves, twice washrooms, twice full clean',
    price: 4299,
    bhkType: '3 BHK',
    frequency: 'Monthly',
    features: [
      'No holiday for maid',
      'Monthly twice washroom cleaning',
      'Monthly twice full house cleaning',
      'Own liquids for cleaning',
    ],
  },
  // Customised/Individual Services
  {
    name: 'Washroom Cleaning',
    category: 'Customised',
    description: 'Hygienic deep cleaning of all washroom fixtures',
    price: 459,
    bhkType: 'N/A',
    frequency: 'One-time',
    features: ['Hygienic deep clean', 'Trained professionals', 'Own cleaning agents'],
  },
  {
    name: 'Only Dishes',
    category: 'Customised',
    description: 'Sparkling clean dishes washed and arranged daily',
    price: 1099,
    bhkType: 'N/A',
    frequency: 'Monthly',
    features: ['Daily washing', 'Utensil sanitization', 'Dishwashing area clean'],
  },
  {
    name: 'Deep Cleaning',
    category: 'Customised',
    description: 'Intensive monthly full house cleaning',
    price: 2499,
    bhkType: 'N/A',
    frequency: 'One-time',
    features: ['Full house scrubbing', 'Stain removal', 'Deep sanitization'],
  },
  {
    name: 'Sweeping & Mopping (1 BHK)',
    category: 'Customised',
    description: 'Daily sweeping and mopping only',
    price: 999,
    bhkType: '1 BHK',
    frequency: 'Monthly',
    features: ['Daily floor sweeping', 'Mopping with disinfectants'],
  },
  {
    name: 'Sweeping & Mopping (2 BHK)',
    category: 'Customised',
    description: 'Daily sweeping and mopping only',
    price: 1499,
    bhkType: '2 BHK',
    frequency: 'Monthly',
    features: ['Daily floor sweeping', 'Mopping with disinfectants'],
  },
  {
    name: 'Sweeping & Mopping (3 BHK)',
    category: 'Customised',
    description: 'Daily sweeping and mopping only',
    price: 1799,
    bhkType: '3 BHK',
    frequency: 'Monthly',
    features: ['Daily floor sweeping', 'Mopping with disinfectants'],
  },
];

const seedData = async () => {
  try {
    // 1. Seed Admin
    const adminExists = await Admin.findOne({ email: 'admin@sweeper.co' });
    if (!adminExists) {
      const admin = new Admin({
        email: 'admin@sweeper.co',
        password: 'adminpassword123',
      });
      await admin.save();
      console.log('✅ Admin User Seeded!');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // 2. Seed Plans
    const plansCount = await Plan.countDocuments();
    if (plansCount === 0) {
      await Plan.insertMany(plans);
      console.log('✅ Subscription Plans Seeded!');
    } else {
      console.log('ℹ️ Plans already exist, skipping seeding');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();

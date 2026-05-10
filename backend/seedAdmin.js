require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

connectDB();

const seedAdmin = async () => {
  try {
    // Check if admin exists
    const adminExists = await Admin.findOne({ email: 'admin@sweeper.co' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new Admin({
      email: 'admin@sweeper.co',
      password: 'adminpassword123',
    });

    await admin.save();
    console.log('Admin User Seeded!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();

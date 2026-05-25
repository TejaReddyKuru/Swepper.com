require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const updateAdmin = async () => {
  await connectDB();
  try {
    // Delete old admin if exists
    await Admin.deleteMany({});
    
    // Create new admin
    const admin = new Admin({
      email: 'vantix',
      password: 'vantix@2026',
    });
    await admin.save();
    console.log('✅ Admin updated to username: vantix');
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
};

updateAdmin();

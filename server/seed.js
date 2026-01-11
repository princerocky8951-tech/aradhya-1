require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    console.log('Connecting to Sanctuary Database...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = 'admin@aradhya.com';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin identity already exists in the registry.');
      process.exit(0);
    }

    // Create Admin User
    // Note: We are using plain text for now to match your current auth.js logic.
    const admin = new User({
      name: 'High Priestess Aradhya',
      email: adminEmail,
      password: 'SanctumPassword2024', // CHANGE THIS IMMEDIATELY AFTER LOGIN
      role: 'admin',
      isSuspended: false
    });

    await admin.save();

    console.log('--------------------------------------------------');
    console.log('ADMIN CREATED SUCCESSFULLY');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: SanctumPassword2024`);
    console.log('Role: admin');
    console.log('--------------------------------------------------');
    console.log('Please delete this script or change the password after first login.');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedAdmin();
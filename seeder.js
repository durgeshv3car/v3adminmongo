const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// DB & Models
const connectDB = require('./config/db');
const Permission = require('./models/Permission');
const Role = require('./models/Role');
const User = require('./models/User');

// Connect DB
connectDB();

const seed = async () => {
  try {
    console.log('🔄 Clearing old data...');
    await Permission.deleteMany();
    await Role.deleteMany();
    await User.deleteMany();

    console.log('✅ Creating permissions...');
    const permissions = await Permission.insertMany([
      { name: 'create_permission' },
      { name: 'view_permission' },
      { name: 'create_role' },
      { name: 'view_role' },
      { name: 'create_slider' },
      { name: 'view_slider' },
      { name: 'delete_slider' },
      { name: 'create_upcoming' },
      { name: 'view_upcoming' },
      { name: 'delete_upcoming' },
      { name: 'manage_users' }
    ]);

    console.log('✅ Creating superadmin role...');
    const superAdminRole = await Role.create({
      name: 'superadmin',
      permissions: permissions.map(p => p._id)
    });

    console.log('✅ Creating superadmin user...');
    const hashedPassword = await bcrypt.hash('123456', 10);

    const superAdminUser = await User.create({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: superAdminRole._id
    });

    const token = jwt.sign({ id: superAdminUser._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    console.log('🎉 Seeder success!');
    console.log(`🔐 Login Email: superadmin@example.com`);
    console.log(`🔑 Password: 123456`);
    console.log(`🔗 JWT Token:\nBearer ${token}`);

    process.exit();
  } catch (err) {
    console.error('❌ Seeder failed:', err.message);
    process.exit(1);
  }
};

seed();

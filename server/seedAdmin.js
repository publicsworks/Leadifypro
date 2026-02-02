const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@prolead.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: admin@prolead.com');
            console.log('Password: admin123');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@prolead.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log('Email: admin@prolead.com');
        console.log('Password: admin123');
        console.log('-----------------------------------');
        console.log('You can now login with these credentials');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedAdmin();

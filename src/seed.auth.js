import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany({});

    const hashed = await bcrypt.hash('123456', 10);

    await User.create({
        email: 'admin@demo.com',
        password: hashed,
        role: 'admin'
    });
    console.log('✅ Usuario admin creado');
    console.log('Email: admin@demo.com');
    console.log('Password: 123456');
    await mongoose.disconnect();
}
run();
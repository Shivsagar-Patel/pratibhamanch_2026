import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Competition from './models/Competition.model.js';
import Admin from './models/Admin.model.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Competition.deleteMany();
    await Admin.deleteMany();

    // Create Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    await Admin.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin seeded!');

    // Create Competitions
    const competitions = [
      {
        name: 'सामान्य ज्ञान प्रतियोगिता',
        slug: 'gk-competition',
        description: 'सामान्य ज्ञान प्रतियोगिता में भाग लें और अपनी प्रतिभा को साबित करें।',
        date: '7 November 2026',
        time: 'Morning',
        entryFee: 30,
        firstPrize: '₹701',
        secondPrize: '₹501',
        categories: ['Class 1 to 8', 'Class 9 to College'],
        rules: [
          'Participant must be a student.',
          'Open to students from any village.'
        ],
        isActive: true,
      },
      {
        name: 'कौन बनेगा हजारपति?',
        slug: 'kbc',
        description: '1500+ preparation questions booklet provided. 60% questions from the booklet.',
        date: '7 November 2026',
        time: 'Evening',
        entryFee: 30,
        firstPrize: '₹2100',
        categories: ['Class 1 to 8', 'Class 9 to College'],
        rules: [
          'Participant must be a student.',
          'Booklet will be provided 15 days before the competition.'
        ],
        isActive: true,
      },
      {
        name: 'शतरंज प्रतियोगिता',
        slug: 'chess',
        description: 'दिमागी खेल शतरंज में अपनी रणनीति दिखाएं।',
        date: '8 November 2026',
        time: 'Morning',
        entryFee: 30,
        firstPrize: '₹1501',
        secondPrize: '₹701',
        categories: ['Open Category'],
        rules: [
          'No age limit.',
          'Participant must be a student.',
          'Open to students from any village.'
        ],
        isActive: true,
      },
      {
        name: 'प्रतिभा खोज – Talent Hunt',
        slug: 'talent-hunt',
        description: 'अपनी छिपी हुई प्रतिभा को मंच पर लाएं (Singing, Poetry, Speech, Acting, Dance, Instrument, Mimicry etc).',
        date: '9 November 2026',
        time: 'Evening/Night',
        entryFee: 0,
        categories: ['Open for all students'],
        rules: [
          'Open for students from any village.'
        ],
        isActive: true,
      }
    ];

    await Competition.insertMany(competitions);
    console.log('Competitions seeded!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import MandiPrice from '../models/MandiPrice.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

dotenv.config({ path: './server/.env' });

const mandiData = [
  ['Lucknow Naveen Mandi', 'Lucknow', 'Gehu', 2360, 26.8467, 80.9462],
  ['Lucknow Naveen Mandi', 'Lucknow', 'Dhan', 2120, 26.8467, 80.9462],
  ['Kanpur Anwarganj Mandi', 'Kanpur', 'Gehu', 2290, 26.4499, 80.3319],
  ['Kanpur Anwarganj Mandi', 'Kanpur', 'Makka', 1940, 26.4499, 80.3319],
  ['Agra Mandi Samiti', 'Agra', 'Sarso', 5120, 27.1767, 78.0081],
  ['Agra Mandi Samiti', 'Agra', 'Aloo', 1280, 27.1767, 78.0081],
  ['Varanasi Mandi', 'Varanasi', 'Dhan', 2190, 25.3176, 82.9739],
  ['Varanasi Mandi', 'Varanasi', 'Pyaaz', 1510, 25.3176, 82.9739],
  ['Prayagraj Krishi Mandi', 'Prayagraj', 'Gehu', 2325, 25.4358, 81.8463],
  ['Prayagraj Krishi Mandi', 'Prayagraj', 'Dhan', 2050, 25.4358, 81.8463],
  ['Mathura Krishi Mandi', 'Mathura', 'Sarso', 4980, 27.4924, 77.6737],
  ['Mathura Krishi Mandi', 'Mathura', 'Aloo', 1210, 27.4924, 77.6737],
  ['Bareilly Mandi Parishad', 'Bareilly', 'Makka', 1880, 28.367, 79.4304],
  ['Bareilly Mandi Parishad', 'Bareilly', 'Gehu', 2240, 28.367, 79.4304],
  ['Gorakhpur Mahhewa Mandi', 'Gorakhpur', 'Dhan', 2145, 26.7606, 83.3732],
  ['Gorakhpur Mahhewa Mandi', 'Gorakhpur', 'Makka', 1975, 26.7606, 83.3732],
  ['Aligarh Dhanipur Mandi', 'Aligarh', 'Sarso', 5050, 27.8974, 78.088],
  ['Aligarh Dhanipur Mandi', 'Aligarh', 'Pyaaz', 1450, 27.8974, 78.088],
  ['Meerut Naveen Mandi', 'Meerut', 'Gehu', 2385, 28.9845, 77.7064],
  ['Meerut Naveen Mandi', 'Meerut', 'Sarso', 5180, 28.9845, 77.7064]
].map(([mandiName, district, crop, pricePerQuintal, latitude, longitude]) => ({
  mandiName,
  district,
  state: 'Uttar Pradesh',
  crop,
  pricePerQuintal,
  date: new Date(),
  latitude,
  longitude
}));

const sampleUsers = [
  ['Ramesh Yadav', '9000000001', 'Lucknow', 2.5, 'Gehu'],
  ['Sita Devi', '9000000002', 'Kanpur', 1.2, 'Dhan'],
  ['Iqbal Khan', '9000000003', 'Agra', 4, 'Sarso'],
  ['Anita Singh', '9000000004', 'Varanasi', 0.8, 'Pyaaz'],
  ['District Officer', '9999999999', 'Lucknow', 0, 'Gehu', 'admin']
];

const posts = [
  ['Lucknow', 'Gehu', 'tip', 'Gehu ki sinchai subah jaldi karne se paani kam lagta hai aur mitti zyada der tak nami rakhti hai.'],
  ['Kanpur', 'Dhan', 'experience', 'Dhan ki nursery me beej treatment karne se pichhle season me rog bahut kam hua.'],
  ['Agra', 'Sarso', 'question', 'Sarso me phool aane ke samay kaunsa spray theek rahega?'],
  ['Varanasi', 'Pyaaz', 'tip', 'Pyaaz ko chhant kar hawa daar jagah rakhne se storage loss kam hota hai.'],
  ['Prayagraj', 'Gehu', 'experience', 'Mandi bhav check karke bechne se is hafte 900 rupaye extra mile.'],
  ['Mathura', 'Aloo', 'tip', 'Aloo ki khudai ke baad turant bori band na karein, pehle chhaya me sukhayein.'],
  ['Bareilly', 'Makka', 'question', 'Makka me fall armyworm ke liye kaun sa organic upay chal raha hai?'],
  ['Gorakhpur', 'Dhan', 'tip', 'Dhan me paani jama na hone dein, alternate wetting se diesel bach raha hai.'],
  ['Aligarh', 'Sarso', 'experience', 'Sarso ki behtar keemat Aligarh mandi me mili, transport ka hisab zaroor karein.'],
  ['Meerut', 'Gehu', 'tip', 'Gehu bechne se pehle moisture check kara lene se rate cut se bachav hota hai.']
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([MandiPrice.deleteMany(), Post.deleteMany(), Comment.deleteMany(), User.deleteMany({ phone: /^9/ })]);
  await MandiPrice.insertMany(mandiData);
  const password = await bcrypt.hash('password123', 10);
  const users = await User.insertMany(sampleUsers.map(([name, phone, district, landSize, primaryCrop, role = 'farmer']) => ({
    name,
    phone,
    password,
    district,
    state: 'Uttar Pradesh',
    landSize,
    primaryCrop,
    role
  })));
  const createdPosts = await Post.insertMany(posts.map(([district, crop, type, content], index) => ({
    author: users[index % 4]._id,
    district,
    crop,
    type,
    content,
    likes: users.slice(0, (index % 3) + 1).map((user) => user._id)
  })));
  await Comment.insertMany(createdPosts.slice(0, 5).map((post, index) => ({
    post: post._id,
    author: users[(index + 1) % 4]._id,
    content: 'Bahut upyogi salah, dhanyavaad!'
  })));
  console.log('Mandi prices, demo users and community posts seeded.');
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

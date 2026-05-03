import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  district: String,
  crop: String,
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  type: { type: String, enum: ['tip', 'question', 'experience'], default: 'tip' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);

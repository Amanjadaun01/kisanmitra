import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  name: String,
  nameHindi: String,
  description: String,
  descriptionHindi: String,
  benefit: String,
  minLandSize: Number,
  maxLandSize: Number,
  maxIncome: Number,
  eligibleCrops: [String],
  documents: [String],
  applyUrl: String,
  applySteps: [String]
});

export default mongoose.model('Scheme', schemeSchema);

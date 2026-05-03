import mongoose from 'mongoose';

const mandiPriceSchema = new mongoose.Schema({
  mandiName: String,
  district: String,
  state: String,
  crop: String,
  pricePerQuintal: Number,
  date: { type: Date, default: Date.now },
  latitude: Number,
  longitude: Number
});

export default mongoose.model('MandiPrice', mandiPriceSchema);

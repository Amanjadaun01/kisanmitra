import User from '../models/User.js';
import Post from '../models/Post.js';
import Scheme from '../models/Scheme.js';
import MandiPrice from '../models/MandiPrice.js';

export const stats = async (req, res) => {
  const [totalFarmers, districts, posts, popularScheme] = await Promise.all([
    User.countDocuments({ role: 'farmer' }),
    User.distinct('district'),
    Post.countDocuments(),
    Scheme.findOne().sort({ name: 1 })
  ]);
  res.json({ totalFarmers, districts: districts.length, posts, popularScheme: popularScheme?.name || 'PM-KISAN Samman Nidhi' });
};

export const cropTrends = async (req, res) => {
  const cropSearches = await MandiPrice.aggregate([
    { $group: { _id: '$crop', searches: { $sum: 14 }, avgPrice: { $avg: '$pricePerQuintal' } } },
    { $sort: { searches: -1 } },
    { $limit: 5 }
  ]);
  const registrations = await User.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $limit: 6 }
  ]);
  res.json({
    topCrops: cropSearches.map((item) => ({ crop: item._id, searches: item.searches, avgPrice: Math.round(item.avgPrice) })),
    registrations: registrations.map((item) => ({ month: item._id, farmers: item.count }))
  });
};

export const schemeStats = async (req, res) => {
  const schemes = await Scheme.find().limit(5);
  res.json(schemes.map((scheme, index) => ({ name: scheme.name, value: [35, 24, 18, 14, 9][index] || 6 })));
};

export const districtMap = async (req, res) => {
  const density = await User.aggregate([
    { $group: { _id: '$district', farmers: { $sum: 1 }, avgLand: { $avg: '$landSize' } } },
    { $sort: { farmers: -1 } }
  ]);
  const coords = {
    Lucknow: [26.8467, 80.9462],
    Kanpur: [26.4499, 80.3319],
    Agra: [27.1767, 78.0081],
    Varanasi: [25.3176, 82.9739],
    Prayagraj: [25.4358, 81.8463],
    Mathura: [27.4924, 77.6737],
    Bareilly: [28.367, 79.4304],
    Gorakhpur: [26.7606, 83.3732],
    Aligarh: [27.8974, 78.088],
    Meerut: [28.9845, 77.7064]
  };
  res.json(density.map((d) => ({ district: d._id, farmers: d.farmers, avgLand: Number(d.avgLand?.toFixed(1) || 0), lat: coords[d._id]?.[0] || 26.8, lng: coords[d._id]?.[1] || 80.9 })));
};

import Scheme from '../models/Scheme.js';

export const eligibleSchemes = async (req, res) => {
  const { landSize = 0, income = 0, crop = '', state = 'Uttar Pradesh' } = req.body;
  const schemes = await Scheme.find({
    $and: [
      { $or: [{ minLandSize: { $lte: Number(landSize) } }, { minLandSize: null }] },
      { $or: [{ maxLandSize: { $gte: Number(landSize) } }, { maxLandSize: 0 }] },
      { $or: [{ maxIncome: { $gte: Number(income) } }, { maxIncome: 0 }] },
      { $or: [{ eligibleCrops: { $in: [crop, 'All'] } }, { eligibleCrops: { $size: 0 } }] }
    ]
  });
  const filtered = schemes.filter((scheme) => scheme.name !== 'UP Kisan Karj Mafi' || state === 'Uttar Pradesh');
  res.json(filtered);
};

export const allSchemes = async (req, res) => {
  res.json(await Scheme.find().sort({ name: 1 }));
};

export const schemeById = async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) return res.status(404).json({ message: 'Scheme not found.' });
  res.json(scheme);
};

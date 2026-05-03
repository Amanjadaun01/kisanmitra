import MandiPrice from '../models/MandiPrice.js';

const toRad = (value) => (value * Math.PI) / 180;

const distanceKm = (lat1, lon1, lat2, lon2) => {
  const earth = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const transportCost = (distance) => Math.round(distance * 2 * 12 + (distance < 20 ? 200 : 0));

export const getPrices = async (req, res) => {
  const { crop, district } = req.query;
  const query = {};
  if (crop) query.crop = new RegExp(`^${crop}$`, 'i');
  if (district) query.district = new RegExp(district, 'i');
  const prices = await MandiPrice.find(query).sort({ pricePerQuintal: -1 });
  res.json({
    records: prices.map((price) => ({
      state: price.state,
      district: price.district,
      market: price.mandiName,
      commodity: price.crop,
      modal_price: price.pricePerQuintal,
      arrival_date: price.date,
      latitude: price.latitude,
      longitude: price.longitude
    }))
  });
};

export const getBestMandi = async (req, res) => {
  const { crop, lat = 26.8467, lng = 80.9462, qty = 10 } = req.query;
  const prices = await MandiPrice.find(crop ? { crop: new RegExp(`^${crop}$`, 'i') } : {});
  const results = prices.map((mandi) => {
    const distance = distanceKm(Number(lat), Number(lng), mandi.latitude, mandi.longitude);
    const cost = transportCost(distance);
    const gross = mandi.pricePerQuintal * Number(qty);
    return {
      _id: mandi._id,
      mandiName: mandi.mandiName,
      district: mandi.district,
      crop: mandi.crop,
      pricePerQuintal: mandi.pricePerQuintal,
      latitude: mandi.latitude,
      longitude: mandi.longitude,
      distanceKm: Number(distance.toFixed(1)),
      transportCost: cost,
      grossValue: gross,
      netProfit: gross - cost
    };
  }).sort((a, b) => b.netProfit - a.netProfit);
  res.json({ best: results[0] || null, results });
};

export const getCrops = async (req, res) => {
  const crops = await MandiPrice.distinct('crop');
  res.json(crops.sort());
};

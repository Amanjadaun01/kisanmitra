import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Scheme from '../models/Scheme.js';

dotenv.config({ path: './server/.env' });

const schemes = [
  ['PM-KISAN Samman Nidhi', 'पीएम-किसान सम्मान निधि', 'Direct income support for small and marginal farmers.', 'छोटे और सीमांत किसानों को सीधी आय सहायता।', 'Rs 6000/year', 0, 5, 0, ['All'], ['Aadhaar', 'Bank passbook', 'Land record'], 'https://pmkisan.gov.in/', ['Check Aadhaar and bank details', 'Register on PM-KISAN portal', 'Submit land record verification']],
  ['PM Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना', 'Crop insurance against weather and yield loss.', 'मौसम और उपज नुकसान के लिए फसल बीमा।', 'Insurance cover up to 90%', 0, 0, 0, ['Gehu', 'Dhan', 'Makka', 'Sarso', 'Aloo', 'Pyaaz'], ['Aadhaar', 'Bank passbook', 'Crop sowing certificate'], 'https://pmfby.gov.in/', ['Visit bank or CSC', 'Choose notified crop', 'Pay farmer premium']],
  ['Kisan Credit Card', 'किसान क्रेडिट कार्ड', 'Affordable working capital credit for cultivation.', 'खेती के लिए सस्ती कार्यशील पूंजी।', 'Credit up to Rs 3 lakh at 4%', 0, 0, 0, ['All'], ['Aadhaar', 'Land record', 'Photo', 'Bank account'], 'https://www.myscheme.gov.in/schemes/kcc', ['Contact nearest bank', 'Submit KCC form', 'Complete land verification']],
  ['PM Krishi Sinchai Yojana', 'प्रधानमंत्री कृषि सिंचाई योजना', 'Micro irrigation support for efficient water use.', 'कुशल जल उपयोग के लिए सूक्ष्म सिंचाई सहायता।', '55% subsidy on drip irrigation', 0, 10, 800000, ['All'], ['Aadhaar', 'Land record', 'Irrigation estimate'], 'https://pmksy.gov.in/', ['Get vendor estimate', 'Apply at agriculture office', 'Install after approval']],
  ['Soil Health Card Scheme', 'मृदा स्वास्थ्य कार्ड योजना', 'Free soil testing and crop nutrient advice.', 'मुफ्त मिट्टी जांच और पोषक सलाह।', 'Free soil testing', 0, 0, 0, ['All'], ['Land details', 'Mobile number'], 'https://soilhealth.dac.gov.in/', ['Give soil sample', 'Collect report', 'Follow nutrient recommendation']],
  ['National Food Security Mission', 'राष्ट्रीय खाद्य सुरक्षा मिशन', 'Support for seeds and productivity inputs.', 'बीज और उत्पादकता सामग्री के लिए सहायता।', 'Subsidized seeds', 0, 8, 600000, ['Gehu', 'Dhan', 'Makka'], ['Aadhaar', 'Land record', 'Farmer registration'], 'https://nfsm.gov.in/', ['Visit block agriculture office', 'Select seed/input', 'Submit farmer ID']],
  ['UP Kisan Karj Mafi', 'यूपी किसान कर्ज माफी', 'Loan relief for eligible Uttar Pradesh farmers.', 'योग्य उत्तर प्रदेश किसानों के लिए ऋण राहत।', 'Loan waiver up to Rs 1 lakh', 0, 5, 300000, ['All'], ['Aadhaar', 'Loan account proof', 'Land record'], 'https://upagripardarshi.gov.in/', ['Verify UP residency', 'Submit bank loan details', 'Track approval online']],
  ['eNAM', 'ई-नाम', 'Digital access to regulated mandi trading.', 'नियमित मंडी व्यापार तक डिजिटल पहुंच।', 'Online trading platform access', 0, 0, 0, ['All'], ['Farmer ID', 'Bank details', 'Commodity details'], 'https://www.enam.gov.in/', ['Register through mandi', 'Add bank details', 'List produce for trade']]
].map(([name, nameHindi, description, descriptionHindi, benefit, minLandSize, maxLandSize, maxIncome, eligibleCrops, documents, applyUrl, applySteps]) => ({
  name,
  nameHindi,
  description,
  descriptionHindi,
  benefit,
  minLandSize,
  maxLandSize,
  maxIncome,
  eligibleCrops,
  documents,
  applyUrl,
  applySteps
}));

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Scheme.deleteMany();
  await Scheme.insertMany(schemes);
  console.log('Government schemes seeded.');
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

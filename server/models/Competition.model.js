import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    date: { type: String }, // e.g., "7 November 2026"
    time: { type: String }, // e.g., "Morning"
    venue: { type: String, default: 'श्रीराम मंदिर के सामने, रेगवां' },
    entryFee: { type: Number, default: 0 },
    firstPrize: { type: String },
    secondPrize: { type: String },
    categories: [{ type: String }], // e.g., ['Class 1 to 8', 'Class 9 to College']
    rules: [{ type: String }],
    bannerImage: { type: String },
    isActive: { type: Boolean, default: true },
    registrationOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Competition = mongoose.model('Competition', competitionSchema);
export default Competition;

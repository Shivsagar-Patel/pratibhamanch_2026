import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    imageUrl: { type: String, required: true },
    ctaText: { type: String },
    ctaLink: { type: String },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;

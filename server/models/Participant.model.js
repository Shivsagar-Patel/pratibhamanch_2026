import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    registrationId: { type: String, required: true, unique: true },
    competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
    participantName: { type: String, required: true },
    fatherName: { type: String, required: true },
    village: { type: String, required: true },
    class: { type: String }, // Optional for chess maybe, but generally needed
    mobile: { type: String, required: true },
    schoolCollege: { type: String },
    age: { type: Number },
    gender: { type: String },
    email: { type: String },
    address: { type: String },
    studentStatus: { type: Boolean, required: true }, // must be true as per rules
    category: { type: String }, // To track which category they chose
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registration for the SAME competition by the SAME mobile
participantSchema.index({ mobile: 1, competitionId: 1 }, { unique: true });

const Participant = mongoose.model('Participant', participantSchema);
export default Participant;

import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    registrationId: { type: String, required: true, unique: true },
    competitionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competition' }], // multiple competitions
    competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition' }, // keep for backward compat
    participantName: { type: String, required: true },
    fatherName: { type: String, required: true },
    village: { type: String, required: true },
    class: { type: String },
    mobile: { type: String, required: true },
    schoolCollege: { type: String },
    age: { type: Number },
    gender: { type: String },
    email: { type: String },
    address: { type: String },
    studentStatus: { type: Boolean, required: true },
    category: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paymentMode: { type: String, enum: ['cash', 'online'], default: 'cash' },
    paidAmount: { type: Number, default: 0 },
    utrNumber: { type: String, trim: true },
    bookletGiven: { type: Boolean, default: false },
    bookletGivenAt: { type: Date },
  },
  { timestamps: true }
);

const Participant = mongoose.model('Participant', participantSchema);
export default Participant;

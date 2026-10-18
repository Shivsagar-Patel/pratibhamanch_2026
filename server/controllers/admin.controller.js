import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model.js';
import Participant from '../models/Participant.model.js';
import Competition from '../models/Competition.model.js';

// @desc    Auth admin & get token
export const authAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
      });
    } else {
      res.status(401).json({ message: 'ईमेल या पासवर्ड गलत है।' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalParticipants = await Participant.countDocuments();
    const competitions = await Competition.find();
    
    const statsByCompetition = await Promise.all(competitions.map(async (comp) => {
      const count = await Participant.countDocuments({
        $or: [
          { competitionIds: comp._id },
          { competitionId: comp._id }
        ]
      });
      return {
        name: comp.name,
        count
      };
    }));

    // Calculate total fees collected & payment counts
    const participants = await Participant.find({}, 'paidAmount paymentStatus');
    const totalRevenue = participants.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const paidCount = participants.filter(p => p.paymentStatus === 'paid').length;
    const pendingCount = participants.filter(p => p.paymentStatus === 'pending').length;

    res.json({
      totalParticipants,
      statsByCompetition,
      activeCompetitions: competitions.filter(c => c.isActive).length,
      totalRevenue,
      paidCount,
      pendingCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all participants with pagination & search
export const getParticipants = async (req, res) => {
  try {
    const pageSize = 100;
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword
      ? {
          $or: [
            { participantName: { $regex: req.query.keyword, $options: 'i' } },
            { mobile: { $regex: req.query.keyword, $options: 'i' } },
            { registrationId: { $regex: req.query.keyword, $options: 'i' } }
          ],
        }
      : {};

    const count = await Participant.countDocuments({ ...keyword });
    const participants = await Participant.find({ ...keyword })
      .populate('competitionId', 'name')
      .populate('competitionIds', 'name')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ participants, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete participant
export const deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByIdAndDelete(req.params.id);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    res.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMode, paidAmount } = req.body;
    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus, 
        paymentMode,
        paidAmount: Number(paidAmount) || 0
      },
      { new: true }
    );
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    res.json({ message: 'Payment status updated', participant });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update participant details
export const updateParticipant = async (req, res) => {
  try {
    const {
      participantName,
      fatherName,
      village,
      mobile,
      className,
      category,
      schoolCollege,
      age,
      gender,
      email,
      address,
      competitionIds,
      paymentStatus,
      paymentMode,
      paidAmount,
    } = req.body;

    const updateData = {};
    if (participantName !== undefined) updateData.participantName = participantName.trim();
    if (fatherName !== undefined) updateData.fatherName = fatherName.trim();
    if (village !== undefined) updateData.village = village.trim();
    if (mobile !== undefined) updateData.mobile = mobile.trim();
    if (className !== undefined) updateData.class = className.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (schoolCollege !== undefined) updateData.schoolCollege = schoolCollege.trim();
    if (age !== undefined) updateData.age = Number(age) || null;
    if (gender !== undefined) updateData.gender = gender;
    if (email !== undefined) updateData.email = email.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (paymentMode !== undefined) updateData.paymentMode = paymentMode;
    if (paidAmount !== undefined) updateData.paidAmount = Number(paidAmount) || 0;

    if (competitionIds && Array.isArray(competitionIds) && competitionIds.length > 0) {
      updateData.competitionIds = competitionIds;
      updateData.competitionId = competitionIds[0];
    }

    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('competitionId', 'name')
      .populate('competitionIds', 'name');

    if (!participant) {
      return res.status(404).json({ message: 'प्रतिभागी नहीं मिला।' });
    }

    res.json({ message: 'प्रतिभागी का विवरण सफलतापूर्वक अपडेट किया गया', participant });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};


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

    // Calculate total fees collected & payment counts & booklet counts
    const participants = await Participant.find({}, 'paidAmount paymentStatus bookletGiven');
    const totalRevenue = participants.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const paidCount = participants.filter(p => p.paymentStatus === 'paid').length;
    const pendingCount = participants.filter(p => p.paymentStatus === 'pending').length;
    const bookletGivenCount = participants.filter(p => p.bookletGiven === true).length;
    const bookletPendingCount = totalParticipants - bookletGivenCount;

    res.json({
      totalParticipants,
      statsByCompetition,
      activeCompetitions: competitions.filter(c => c.isActive).length,
      totalRevenue,
      paidCount,
      pendingCount,
      bookletGivenCount,
      bookletPendingCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all participants with pagination, search & filters
export const getParticipants = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.pageNumber) || Number(req.query.page) || 1);
    const isAll = req.query.pageSize === 'all' || req.query.limit === 'all';
    const pageSize = isAll ? 0 : Math.max(1, Number(req.query.pageSize) || Number(req.query.limit) || 20);
    
    const conditions = [];

    // Search keyword
    if (req.query.keyword && req.query.keyword.trim()) {
      const kw = req.query.keyword.trim();
      conditions.push({
        $or: [
          { participantName: { $regex: kw, $options: 'i' } },
          { fatherName: { $regex: kw, $options: 'i' } },
          { mobile: { $regex: kw, $options: 'i' } },
          { registrationId: { $regex: kw, $options: 'i' } },
          { village: { $regex: kw, $options: 'i' } },
          { schoolCollege: { $regex: kw, $options: 'i' } },
          { utrNumber: { $regex: kw, $options: 'i' } },
        ],
      });
    }
    

    
    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      conditions.push({ category: req.query.category });
    }

    // Class filter
    if (req.query.class && req.query.class !== 'all') {
      conditions.push({ class: req.query.class });
    }

    // Payment Status filter
    if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
      conditions.push({ paymentStatus: req.query.paymentStatus });
    }

    // Booklet Given filter ('true' / 'false' / 'all')
    if (req.query.bookletGiven && req.query.bookletGiven !== 'all') {
      if (req.query.bookletGiven === 'true') {
        conditions.push({ bookletGiven: true });
      } else if (req.query.bookletGiven === 'false') {
        conditions.push({ bookletGiven: { $ne: true } });
      }
    }

    // Competition filter
    if (req.query.competitionId && req.query.competitionId !== 'all') {
      conditions.push({
        $or: [
          { competitionIds: req.query.competitionId },
          { competitionId: req.query.competitionId },
        ],
      });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};

    const count = await Participant.countDocuments(query);
    
    let queryBuilder = Participant.find(query)
      .populate('competitionId', 'name')
      .populate('competitionIds', 'name')
      .sort({ createdAt: -1 });

    if (!isAll && pageSize > 0) {
      queryBuilder = queryBuilder.skip(pageSize * (page - 1)).limit(pageSize);
    }

    const participants = await queryBuilder;

    // Fetch distinct categories & classes to populate filter dropdowns dynamically
    const [availableCategories, availableClasses] = await Promise.all([
      Participant.distinct('category', { category: { $nin: [null, ''] } }),
      Participant.distinct('class', { class: { $nin: [null, ''] } }),
    ]);

    res.json({
      participants,
      page: isAll ? 1 : page,
      pages: isAll ? 1 : Math.ceil(count / pageSize) || 1,
      total: count,
      pageSize: isAll ? count : pageSize,
      availableCategories,
      availableClasses,
    });
  } catch (error) {
    console.error('getParticipants error:', error);
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
    const { paymentStatus, paymentMode, paidAmount, utrNumber } = req.body;
    const updateFields = { 
      paymentStatus, 
      paymentMode,
      paidAmount: Number(paidAmount) || 0
    };
    if (utrNumber !== undefined) updateFields.utrNumber = utrNumber.trim();

    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      updateFields,
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
      utrNumber,
      bookletGiven,
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
    if (utrNumber !== undefined) updateData.utrNumber = utrNumber.trim();
    if (bookletGiven !== undefined) {
      updateData.bookletGiven = Boolean(bookletGiven);
      updateData.bookletGivenAt = updateData.bookletGiven ? new Date() : null;
    }

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

// @desc    Update booklet given status
export const updateBookletStatus = async (req, res) => {
  try {
    const { bookletGiven } = req.body;
    const isGiven = Boolean(bookletGiven);
    const updateData = {
      bookletGiven: isGiven,
      bookletGivenAt: isGiven ? new Date() : null,
    };

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

    res.json({
      message: isGiven ? 'बुकलेट सफलतापूर्वक प्रदान की गई' : 'बुकलेट स्थिति अपडेट की गई (नहीं दी)',
      participant,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


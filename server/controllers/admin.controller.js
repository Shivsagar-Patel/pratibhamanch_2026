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
    
    // Total by competition
    const statsByCompetition = await Promise.all(competitions.map(async (comp) => {
      const count = await Participant.countDocuments({ competitionId: comp._id });
      return {
        name: comp.name,
        count
      };
    }));

    res.json({
      totalParticipants,
      statsByCompetition,
      activeCompetitions: competitions.filter(c => c.isActive).length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all participants with pagination & search
export const getParticipants = async (req, res) => {
  try {
    const pageSize = 50;
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
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ participants, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

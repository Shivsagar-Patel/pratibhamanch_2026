import Participant from '../models/Participant.model.js';
import Competition from '../models/Competition.model.js';

export const registerParticipant = async (req, res) => {
  try {
    const {
      competitionId,
      participantName,
      fatherName,
      village,
      className, // using className as class is reserved word
      mobile,
      schoolCollege,
      age,
      gender,
      email,
      address,
      studentStatus,
      category,
    } = req.body;

    if (!competitionId || !participantName || !fatherName || !village || !mobile) {
      return res.status(400).json({ message: 'कृपया सभी आवश्यक जानकारी भरें।' });
    }

    if (!studentStatus) {
      return res.status(400).json({ message: 'विद्यार्थी होना अनिवार्य है।' });
    }

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ message: 'प्रतियोगिता नहीं मिली।' });
    }
    
    if (!competition.registrationOpen) {
      return res.status(400).json({ message: 'इस प्रतियोगिता के लिए पंजीकरण बंद हो चुका है।' });
    }

    // Check Duplicate
    const existing = await Participant.findOne({ mobile, competitionId });
    if (existing) {
      return res.status(400).json({ message: 'इस मोबाइल नंबर से इस प्रतियोगिता के लिए पहले ही पंजीकरण हो चुका है।' });
    }

    // Generate Unique Registration ID (e.g., TM2026-0001)
    const count = await Participant.countDocuments();
    const registrationId = `TM2026-${(count + 1).toString().padStart(4, '0')}`;

    const participant = await Participant.create({
      registrationId,
      competitionId,
      participantName,
      fatherName,
      village,
      class: className,
      mobile,
      schoolCollege,
      age,
      gender,
      email,
      address,
      studentStatus,
      category,
    });

    res.status(201).json({
      message: 'पंजीयन सफल हुआ',
      participant,
      competition: {
        name: competition.name,
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'इस मोबाइल नंबर से इस प्रतियोगिता के लिए पहले ही पंजीकरण हो चुका है।' });
    }
    res.status(500).json({ message: error.message || 'सर्वर त्रुटि' });
  }
};

import Participant from '../models/Participant.model.js';
import Competition from '../models/Competition.model.js';

export const registerParticipant = async (req, res) => {
  try {
    const {
      competitionIds, // array of selected competition IDs
      participantName,
      fatherName,
      village,
      className,
      mobile,
      schoolCollege,
      age,
      gender,
      email,
      address,
      studentStatus,
      category,
    } = req.body;

    if (!competitionIds || competitionIds.length === 0 || !participantName || !fatherName || !village || !mobile) {
      return res.status(400).json({ message: 'कृपया सभी आवश्यक जानकारी भरें।' });
    }

    if (!studentStatus) {
      return res.status(400).json({ message: 'विद्यार्थी होना अनिवार्य है।' });
    }

    // Validate all competitions exist and are open
    for (const compId of competitionIds) {
      const competition = await Competition.findById(compId);
      if (!competition) {
        return res.status(404).json({ message: 'प्रतियोगिता नहीं मिली।' });
      }
      if (!competition.registrationOpen) {
        return res.status(400).json({ message: `"${competition.name}" के लिए पंजीकरण बंद हो चुका है।` });
      }
    }

    // Check Duplicate for any of the selected competitions
    for (const compId of competitionIds) {
      const existing = await Participant.findOne({ mobile, competitionId: compId });
      if (existing) {
        const comp = await Competition.findById(compId);
        return res.status(400).json({ message: `इस मोबाइल नंबर से "${comp?.name}" प्रतियोगिता के लिए पहले ही पंजीकरण हो चुका है।` });
      }
    }

    // Generate Unique Registration ID (e.g., vande001, vande002...)
    const lastParticipant = await Participant.findOne({ registrationId: /^vande\d+$/i }).sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastParticipant && lastParticipant.registrationId) {
      const match = lastParticipant.registrationId.match(/\d+$/);
      if (match) {
        nextNum = parseInt(match[0], 10) + 1;
      }
    } else {
      const count = await Participant.countDocuments();
      nextNum = count + 1;
    }
    const registrationId = `VANDE-${nextNum.toString().padStart(3, '0')}`;

    // Use first competition as primary for backward compat
    const participant = await Participant.create({
      registrationId,
      competitionId: competitionIds[0],
      competitionIds,
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
      paymentStatus: 'pending',
      paymentMode: 'cash',
    });

    // Populate for response
    const populated = await Participant.findById(participant._id).populate('competitionIds', 'name').populate('competitionId', 'name');

    res.status(201).json({
      message: 'पंजीयन सफल हुआ',
      participant: populated,
      competition: {
        name: populated.competitionIds?.map(c => c.name).join(', ') || populated.competitionId?.name,
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'इस मोबाइल नंबर से इस प्रतियोगिता के लिए पहले ही पंजीकरण हो चुका है।' });
    }
    res.status(500).json({ message: error.message || 'सर्वर त्रुटि' });
  }
};

export const getParticipantById = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id)
      .populate('competitionIds', 'name')
      .populate('competitionId', 'name');

    if (!participant) {
      return res.status(404).json({ message: 'प्रतिभागी नहीं मिला।' });
    }

    res.json({
      participant,
      competition: {
        name: participant.competitionIds?.map(c => c.name).join(', ') || participant.competitionId?.name,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'सर्वर त्रुटि' });
  }
};

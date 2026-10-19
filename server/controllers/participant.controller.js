import Participant from '../models/Participant.model.js';
import Competition from '../models/Competition.model.js';
import Counter from '../models/Counter.model.js';

// Sequential Registration ID generator (VANDE-001, VANDE-002, VANDE-003...)
const getNextRegistrationId = async () => {
  let counter = await Counter.findById('participant_registration');
  if (!counter) {
    const participants = await Participant.find({}, { registrationId: 1 });
    let maxNum = 0;
    for (const p of participants) {
      if (p.registrationId) {
        const match = p.registrationId.match(/\d+$/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      }
    }
    counter = await Counter.create({ _id: 'participant_registration', seq: maxNum });
  }

  let updatedCounter = await Counter.findByIdAndUpdate(
    'participant_registration',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  let regId = `VANDE-${updatedCounter.seq.toString().padStart(3, '0')}`;
  while (await Participant.exists({ registrationId: regId })) {
    updatedCounter = await Counter.findByIdAndUpdate(
      'participant_registration',
      { $inc: { seq: 1 } },
      { new: true }
    );
    regId = `VANDE-${updatedCounter.seq.toString().padStart(3, '0')}`;
  }

  return regId;
};

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

    // Generate Unique Registration ID sequentially (VANDE-001, VANDE-002...)
    const registrationId = await getNextRegistrationId();

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
      return res.status(400).json({ message: 'पंजीकरण संख्या (Registration ID) पहले से मौजूद है। कृपया पुनः प्रयास करें।' });
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

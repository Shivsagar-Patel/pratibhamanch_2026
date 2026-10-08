import Competition from '../models/Competition.model.js';

export const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find().sort({ createdAt: 1 });
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCompetitionBySlug = async (req, res) => {
  try {
    const competition = await Competition.findOne({ slug: req.params.slug });
    if (competition) {
      res.json(competition);
    } else {
      res.status(404).json({ message: 'Competition not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

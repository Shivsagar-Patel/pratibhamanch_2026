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

// @desc Create new competition (Admin)
export const createCompetition = async (req, res) => {
  try {
    const { name, description, date, time, venue, entryFee, firstPrize, secondPrize, categories, rules, isActive, registrationOpen } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'प्रतियोगिता का नाम अनिवार्य है।' });
    }

    let baseSlug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!baseSlug) baseSlug = `comp-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (await Competition.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const comp = await Competition.create({
      name: name.trim(),
      slug,
      description: description?.trim() || '',
      date: date?.trim() || '7, 8, 9 नवंबर 2026',
      time: time?.trim() || 'प्रातः काल',
      venue: venue?.trim() || 'श्रीराम मंदिर के सामने, रेगवां',
      entryFee: Number(entryFee) || 0,
      firstPrize: firstPrize?.trim() || '',
      secondPrize: secondPrize?.trim() || '',
      categories: Array.isArray(categories) ? categories : (categories ? categories.split(',').map(c => c.trim()).filter(Boolean) : ['कक्षा 1 से 8', 'कक्षा 9 से कॉलेज']),
      rules: Array.isArray(rules) ? rules : (rules ? rules.split('\n').map(r => r.trim()).filter(Boolean) : []),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      registrationOpen: registrationOpen !== undefined ? Boolean(registrationOpen) : true
    });

    res.status(201).json({ message: 'प्रतियोगिता सफलतापूर्वक जोड़ी गई', competition: comp });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc Update competition (Admin)
export const updateCompetition = async (req, res) => {
  try {
    const { name, slug, description, date, time, venue, entryFee, firstPrize, secondPrize, categories, rules, isActive, registrationOpen } = req.body;
    const comp = await Competition.findById(req.params.id);
    if (!comp) {
      return res.status(404).json({ message: 'प्रतियोगिता नहीं मिली।' });
    }

    if (name) comp.name = name.trim();
    if (slug && slug.trim() !== comp.slug) {
      const existing = await Competition.findOne({ slug: slug.trim(), _id: { $ne: comp._id } });
      if (!existing) comp.slug = slug.trim();
    }
    if (description !== undefined) comp.description = description.trim();
    if (date !== undefined) comp.date = date.trim();
    if (time !== undefined) comp.time = time.trim();
    if (venue !== undefined) comp.venue = venue.trim();
    if (entryFee !== undefined) comp.entryFee = Number(entryFee) || 0;
    if (firstPrize !== undefined) comp.firstPrize = firstPrize.trim();
    if (secondPrize !== undefined) comp.secondPrize = secondPrize.trim();
    if (categories !== undefined) {
      comp.categories = Array.isArray(categories) ? categories : categories.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (rules !== undefined) {
      comp.rules = Array.isArray(rules) ? rules : rules.split('\n').map(r => r.trim()).filter(Boolean);
    }
    if (isActive !== undefined) comp.isActive = Boolean(isActive);
    if (registrationOpen !== undefined) comp.registrationOpen = Boolean(registrationOpen);

    await comp.save();
    res.json({ message: 'प्रतियोगिता सफलतापूर्वक अपडेट की गई', competition: comp });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc Delete competition (Admin)
export const deleteCompetition = async (req, res) => {
  try {
    const comp = await Competition.findByIdAndDelete(req.params.id);
    if (!comp) {
      return res.status(404).json({ message: 'प्रतियोगिता नहीं मिली।' });
    }
    res.json({ message: 'प्रतियोगिता सफलतापूर्वक हटाई गई' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

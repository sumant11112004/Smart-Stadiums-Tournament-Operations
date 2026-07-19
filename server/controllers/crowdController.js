const CrowdData = require('../models/CrowdData');

// Initial seed/default crowd status
const defaultZones = [
  { zone: 'Gate A', density: 'low', queueTimeMinutes: 3, suggestions: 'Gate is clear. Recommended for North and East stand ticket holders.' },
  { zone: 'Gate B', density: 'critical', queueTimeMinutes: 28, suggestions: 'Severe congestion. Avoid Gate B. Reroute to Gate D.' },
  { zone: 'Gate C', density: 'medium', queueTimeMinutes: 12, suggestions: 'Steady flow. Standard security searches active.' },
  { zone: 'Gate D', density: 'low', queueTimeMinutes: 4, suggestions: 'Clear pathways. Wheelchair accessible elevator fully available.' },
  { zone: 'Concourse 1 (East)', density: 'high', queueTimeMinutes: 18, suggestions: 'Concession stands are busy. Try the West Deck for quicker options.' },
  { zone: 'Concourse 2 (West)', density: 'low', queueTimeMinutes: 2, suggestions: 'Low congestion. Restrooms and hydration stations are vacant.' },
  { zone: 'Parking North', density: 'high', queueTimeMinutes: 15, suggestions: '95% capacity. Secondary exit lanes have been opened.' },
  { zone: 'Parking South', density: 'low', queueTimeMinutes: 1, suggestions: 'Clear parking lines. Free electric shuttles running every 3 minutes.' }
];

// @desc    Get current crowd status and suggestions
// @route   GET /api/crowd/status
// @access  Public
const getCrowdStatus = async (req, res, next) => {
  try {
    let zones;
    try {
      zones = await CrowdData.find({});
      if (zones.length === 0) {
        // Automatically seed defaults into the DB if connected
        zones = await CrowdData.insertMany(defaultZones);
      }
    } catch (dbErr) {
      console.warn('⚠️ Using in-memory fallback for crowd telemetry.');
      zones = defaultZones;
    }
    res.json(zones);
  } catch (error) {
    next(error);
  }
};

// @desc    Update zone telemetry (Admin only)
// @route   PUT /api/crowd/status/:id
// @access  Private/Admin
const updateCrowdZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { density, queueTimeMinutes, suggestions } = req.body;

    if (!density || queueTimeMinutes === undefined) {
      res.status(400);
      return next(new Error('Please add density and queue time'));
    }

    let updatedZone;
    try {
      updatedZone = await CrowdData.findByIdAndUpdate(
        id,
        { density, queueTimeMinutes, suggestions, updatedBy: req.user._id },
        { new: true, runValidators: true }
      );
    } catch (dbErr) {
      // In-memory update simulator for demo mode
      console.warn('⚠️ In-memory simulated update for zone ID:', id);
      updatedZone = {
        _id: id,
        density,
        queueTimeMinutes,
        suggestions,
        updatedBy: req.user._id,
        updatedAt: new Date()
      };
    }

    if (!updatedZone) {
      res.status(404);
      return next(new Error('Zone not found'));
    }

    res.json(updatedZone);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCrowdStatus,
  updateCrowdZone,
};

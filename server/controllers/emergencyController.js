const EmergencyLog = require('../models/EmergencyLog');

const defaultAlerts = [
  {
    _id: 'mock_alert_1',
    type: 'medical',
    details: 'Chest pains reported in Section 104, Row G.',
    route: 'Clear access paths in Sector 104 Concourse. Direct paramedics via elevator B.',
    responseTeam: 'Medical Team 3 (Zone East)',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 12)
  },
  {
    _id: 'mock_alert_2',
    type: 'lost_child',
    details: '7-year-old child in a yellow jersey separated from parents near gate D.',
    route: 'Secure perimeter exits at Gate D. Broadcast description to all steward scanners.',
    responseTeam: 'Marshal Command Delta',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 25)
  },
  {
    _id: 'mock_alert_3',
    type: 'weather',
    details: 'High wind warnings and flash lightning warning within 5km radius.',
    route: 'Open shelter zones under lower concourses. Advise upper tier spectators to remain seated under roof structures.',
    responseTeam: 'Operations Weather Command',
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
];

// @desc    Get active emergency logs
// @route   GET /api/emergency/alerts
// @access  Public
const getActiveAlerts = async (req, res, next) => {
  try {
    let alerts;
    try {
      alerts = await EmergencyLog.find({}).sort({ createdAt: -1 });
      if (alerts.length === 0) {
        alerts = await EmergencyLog.insertMany(defaultAlerts);
      }
    } catch (dbErr) {
      console.warn('⚠️ Using in-memory fallback for emergency alerts.');
      alerts = defaultAlerts;
    }
    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger a mock/real emergency alert (Admin or Authorized users)
// @route   POST /api/emergency/trigger
// @access  Private
const triggerAlert = async (req, res, next) => {
  try {
    const { type, details, route, responseTeam } = req.body;

    if (!type || !details || !route || !responseTeam) {
      res.status(400);
      return next(new Error('Please add type, details, evacuation route, and response team details'));
    }

    let alert;
    try {
      alert = await EmergencyLog.create({
        type,
        details,
        route,
        responseTeam,
        status: 'active'
      });
    } catch (dbErr) {
      console.warn('⚠️ Creating in-memory simulated emergency log.');
      alert = {
        _id: 'mock_alert_' + Date.now(),
        type,
        details,
        route,
        responseTeam,
        status: 'active',
        createdAt: new Date()
      };
    }

    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve alert (Admin only)
// @route   PUT /api/emergency/resolve/:id
// @access  Private/Admin
const resolveAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    let updatedAlert;
    try {
      updatedAlert = await EmergencyLog.findByIdAndUpdate(
        id,
        { status: 'resolved' },
        { new: true }
      );
    } catch (dbErr) {
      console.warn('⚠️ In-memory resolving emergency alert ID:', id);
      updatedAlert = {
        _id: id,
        status: 'resolved',
        updatedAt: new Date()
      };
    }

    if (!updatedAlert) {
      res.status(404);
      return next(new Error('Alert not found'));
    }

    res.json(updatedAlert);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActiveAlerts,
  triggerAlert,
  resolveAlert,
};

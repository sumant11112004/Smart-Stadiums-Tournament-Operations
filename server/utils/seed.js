const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CrowdData = require('../models/CrowdData');
const EmergencyLog = require('../models/EmergencyLog');
const User = require('../models/User');

dotenv.config();

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

const defaultAlerts = [
  {
    type: 'medical',
    details: 'Chest pains reported in Section 104, Row G.',
    route: 'Clear access paths in Sector 104 Concourse. Direct paramedics via elevator B.',
    responseTeam: 'Medical Team 3 (Zone East)',
    status: 'active'
  },
  {
    type: 'lost_child',
    details: '7-year-old child in a yellow jersey separated from parents near gate D.',
    route: 'Secure perimeter exits at Gate D. Broadcast description to all steward scanners.',
    responseTeam: 'Marshal Command Delta',
    status: 'active'
  },
  {
    type: 'weather',
    details: 'High wind warnings and flash lightning warning within 5km radius.',
    route: 'Open shelter zones under lower concourses. Advise upper tier spectators to remain seated under roof structures.',
    responseTeam: 'Operations Weather Command',
    status: 'resolved'
  }
];

const seedDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-stadiums';
    await mongoose.connect(connUri);
    console.log('connected to database for seeding...');

    // Clear existing
    await CrowdData.deleteMany({});
    await EmergencyLog.deleteMany({});
    
    // Seed
    await CrowdData.insertMany(defaultZones);
    await EmergencyLog.insertMany(defaultAlerts);

    console.log('✅ Telemetry Seed Successful!');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error.message);
    process.exit(1);
  }
};

seedDB();

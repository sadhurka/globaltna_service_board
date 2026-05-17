// seed.js
// If .env is in the same folder as seed.js, use './.env'. If seed.js is in a subfolder like /scripts, leave it as '../.env'
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const mongoose = require('mongoose');
const JobRequest = require('./models/JobRequest');

// Fallback logic so it doesn't crash on an empty string
const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  // Catch the missing URI before Mongoose tries to use it
  if (!MONGODB_URI) {
    console.error('❌  Seed error: MONGODB_URI is undefined. Check your .env file path!');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅  Connected to MongoDB');

    await JobRequest.deleteMany({});
    console.log('🗑   Cleared existing jobs');

    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`🌱  Seeded ${inserted.length} sample jobs`);
  } catch (err) {
    console.error('❌  Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋  Disconnected');
  }
}


// Sample jobs to seed the database
const sampleJobs = [
  // --- PLUMBING ---
  {
    title: 'Fix leaking kitchen sink',
    description: 'The kitchen sink pipe is dripping continuously and needs an urgent repair. Suspect it is a worn washer or loose joint.',
    category: 'Plumbing',
    location: '123 Main St, Springfield',
    contactName: 'John Doe',
    contactEmail: 'john@example.com',
    status: 'Open',
  },
  {
    title: 'Unblock main drainage pipe',
    description: 'Main exterior drain is completely blocked and overflowing into the driveway. Requires professional equipment to clear.',
    category: 'Plumbing',
    location: '101 Riverside Ave',
    contactName: 'Alice Green',
    contactEmail: 'alice.g@example.com',
    status: 'In Progress',
  },
  {
    title: 'Install new bathroom suite',
    description: 'Need a complete installation of a new toilet, wash basin, and shower enclosure. Old suite is already removed.',
    category: 'Plumbing',
    location: '44 Bath Road, Waterside',
    contactName: 'Paul Evans',
    contactEmail: 'paul.evans@example.com',
    status: 'Open',
  },

  // --- ELECTRICAL ---
  {
    title: 'Install new ceiling light fixture',
    description: 'Need a heavy chandelier-style light fixture installed in the living room. High ceilings, so a tall ladder is required.',
    category: 'Electrical',
    location: '456 Elm St, Springfield',
    contactName: 'Jane Smith',
    contactEmail: 'jane@example.com',
    status: 'Open',
  },
  {
    title: 'Rewire kitchen extensions',
    description: 'Adding an extension and need completely new wiring, including 6 double sockets, an oven switch, and downlights.',
    category: 'Electrical',
    location: '24 Crescent Way, Eastside',
    contactName: 'Tom Harding',
    contactEmail: 'tharding@example.com',
    status: 'Open',
  },
  {
    title: 'Fix tripping fuse box',
    description: 'The fuse box keeps tripping whenever the washing machine is turned on. Need an electrician to diagnose and fix the fault.',
    category: 'Electrical',
    location: '12 Power Lane',
    contactName: 'Lucy Wood',
    contactEmail: 'lwood@example.com',
    status: 'Closed',
  },

  // --- PAINTING ---
  {
    title: 'Repaint exterior of 3-bedroom house',
    description: 'Looking to completely repaint the exterior rendering of a semi-detached house. Paint and primer will be supplied, need labor and tools.',
    category: 'Painting',
    location: '78 Pine Road, Northville',
    contactName: 'Mark Johnson',
    contactEmail: 'mark.j@example.com',
    status: 'In Progress',
  },
  {
    title: 'Interior painting - 2 bedrooms',
    description: 'Need two medium-sized bedrooms painted. Walls and skirting boards. Empty rooms, ready to paint.',
    category: 'Painting',
    location: '15 Meadow Close',
    contactName: 'Sophie Turner',
    contactEmail: 'sturner@example.com',
    status: 'Open',
  },
  {
    title: 'Paint garden fences and decking',
    description: 'Require a professional to spray-paint 10 panels of wooden garden fencing and stain the back decking.',
    category: 'Painting',
    location: '5 Garden View',
    contactName: 'Alan Croft',
    contactEmail: 'acroft@example.com',
    status: 'Open',
  },

  // --- JOINERY ---
  {
    title: 'Custom oak shelving unit',
    description: 'Need a custom joiner to design and install built-in oak shelving on either side of the living room fireplace.',
    category: 'Joinery',
    location: '12 Maple Drive, Oakwood',
    contactName: 'Sarah Jenkins',
    contactEmail: 'sarah.j@example.com',
    status: 'Open',
  },
  {
    title: 'Hang 4 internal oak doors',
    description: 'Have 4 new solid oak internal doors that need hanging. Handles and hinges need to be fitted as well.',
    category: 'Joinery',
    location: '77 Forest Hill',
    contactName: 'Chloe White',
    contactEmail: 'chloe.w@example.com',
    status: 'Open',
  },
  {
    title: 'Build custom garden shed',
    description: 'Looking for a joiner to build a bespoke heavy-duty garden shed from scratch (approx 8x10ft) to fit a specific corner.',
    category: 'Joinery',
    location: '20 Timber Way',
    contactName: 'Brian Moore',
    contactEmail: 'bmoore@example.com',
    status: 'In Progress',
  },

  // --- ROOFING ---
  {
    title: 'Repair missing roof tiles',
    description: 'Recent storm blew off about 5-6 slate tiles from the roof. Need them replaced to prevent water damage.',
    category: 'Roofing',
    location: '55 High St, West End',
    contactName: 'Robert Clarke',
    contactEmail: 'rclarke@example.com',
    status: 'Open',
  },
  {
    title: 'Flat roof re-felting',
    description: 'The flat roof on the garage is leaking and needs to be completely stripped and re-felted (approx 15 sqm).',
    category: 'Roofing',
    location: '88 Garage Lane',
    contactName: 'David Miller',
    contactEmail: 'dmiller@example.com',
    status: 'Open',
  },
  {
    title: 'Clean and repair gutters',
    description: 'Gutters are overflowing with moss and leaves. Need them fully cleared, and one section re-aligned as it is sagging.',
    category: 'Roofing',
    location: '41 Rainey Street',
    contactName: 'Gary Stone',
    contactEmail: 'garys@example.com',
    status: 'Closed',
  },

  // --- FLOORING ---
  {
    title: 'Laminate flooring installation',
    description: 'Looking for a professional to lay 40 square meters of laminate flooring in the hallway and dining room. Underlay already purchased.',
    category: 'Flooring',
    location: '90 Baker St, Central',
    contactName: 'Emily Davis',
    contactEmail: 'emily.davis@example.com',
    status: 'Closed',
  },
  {
    title: 'Carpet fitting for stairs and landing',
    description: 'Need thick carpet fitted on a straight staircase (13 steps) and a small landing. I have the carpet but need underlay and grippers.',
    category: 'Flooring',
    location: '11 Step Close',
    contactName: 'Jessica Bell',
    contactEmail: 'jbell@example.com',
    status: 'Open',
  },
  {
    title: 'Refinish original hardwood floors',
    description: 'Original Victorian pine floorboards in the lounge need sanding back, gaps filled, and 3 coats of varnish applied.',
    category: 'Flooring',
    location: '19 Heritage Row',
    contactName: 'Oliver Twist',
    contactEmail: 'otwist@example.com',
    status: 'In Progress',
  },

  // --- OTHER ---
  {
    title: 'Plastering and skimming living room',
    description: 'Need the walls and ceiling of a 4x5m living room re-skimmed. Old wallpaper has been removed but walls are quite uneven.',
    category: 'Other',
    location: '42 Victoria Road',
    contactName: 'Liam Brown',
    contactEmail: 'lbrown@example.com',
    status: 'Open',
  },
  {
    title: 'Brickwork repair on garden wall',
    description: 'A section of the front garden brick wall has collapsed due to a tree root. Need the root removed and wall rebuilt (approx 2m long).',
    category: 'Other',
    location: '66 Stone Avenue',
    contactName: 'Fiona Gallagher',
    contactEmail: 'fgallagher@example.com',
    status: 'Open',
  },
  {
    title: 'General handyman tasks',
    description: 'Need help hanging 3 heavy mirrors, putting up curtain poles in 4 rooms, and assembling a flat-pack wardrobe.',
    category: 'Other',
    location: '8 Handy Street',
    contactName: 'Neil Patrick',
    contactEmail: 'npatrick@example.com',
    status: 'Open',
  }
];

seed();
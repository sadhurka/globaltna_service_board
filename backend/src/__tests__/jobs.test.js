const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const JobRequest = require('../models/JobRequest');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/globaltna_test';

// Use the admin password directly as the authorized token
const testToken = process.env.ADMIN_PASSWORD || 'GlobalTnaAdmin2026';
beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

afterEach(async () => {
  await JobRequest.deleteMany({});
});

// ── POST /api/jobs ────────────────────────────────────────────────────────────
describe('POST /api/jobs', () => {
  it('creates a job with valid data and returns 201', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${testToken}`) // Inject the valid key
      .send({
        title: 'Fix leaking tap',
        description: 'Kitchen tap drips constantly.',
        category: 'Plumbing',
        location: 'Glasgow',
        contactName: 'Alice',
        contactEmail: 'alice@example.com',
      });

    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Fix leaking tap');
    expect(res.body.data.status).toBe('Open');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/jobs').send({
      description: 'No title supplied.',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when description is missing', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Valid title',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for an invalid email', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Valid title',
      description: 'Valid description',
      contactEmail: 'not-an-email',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ── GET /api/jobs ─────────────────────────────────────────────────────────────
describe('GET /api/jobs', () => {
  beforeEach(async () => {
    await JobRequest.insertMany([
      { title: 'Job A', description: 'Desc A', category: 'Plumbing', status: 'Open' },
      { title: 'Job B', description: 'Desc B', category: 'Electrical', status: 'Closed' },
      { title: 'Job C', description: 'Desc C', category: 'Plumbing', status: 'In Progress' },
    ]);
  });

  it('returns all jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3);
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/jobs?category=Plumbing');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
  });

  it('filters by status', async () => {
    const res = await request(app).get('/api/jobs?status=Closed');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].status).toBe('Closed');
  });
});

// ── PATCH /api/jobs/:id ───────────────────────────────────────────────────────
describe('PATCH /api/jobs/:id', () => {
  let jobId;

  beforeEach(async () => {
    const job = await JobRequest.create({
      title: 'Test job',
      description: 'Test description',
    });
    jobId = job._id.toString();
  });

  it('updates status successfully', async () => {
    const res = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .send({ status: 'In Progress' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('In Progress');
  });

  it('returns 400 for an invalid status value', async () => {
    const res = await request(app)
      .patch(`/api/jobs/${jobId}`)
      .send({ status: 'Pending' });
    expect(res.status).toBe(400);
  });

  it('returns 404 for a non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/jobs/${fakeId}`)
      .send({ status: 'Closed' });
    expect(res.status).toBe(404);
  });
});

// ── DELETE /api/jobs/:id ──────────────────────────────────────────────────────
describe('DELETE /api/jobs/:id', () => {
  it('deletes an existing job', async () => {
    const job = await JobRequest.create({ title: 'To delete', description: 'Gone soon' });
    const res = await request(app).delete(`/api/jobs/${job._id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await JobRequest.findById(job._id);
    expect(check).toBeNull();
  });

  it('returns 404 for a non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/jobs/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

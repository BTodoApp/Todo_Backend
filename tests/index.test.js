const request = require('supertest');
const app = require('../index');
const { User, Board, List } = require('../models/index');
const dotenv = require('dotenv');
const { db } = require('../models/index')
dotenv.config();

beforeAll(async () => {
  // Perform the database synchronization before running the tests
  await db.sync({ force: true });
});

afterAll(async () => {
  await app.close();
});

describe('User Endpoints', () => {
  it('should return an array of users', async () => {

    const res = await request(app)
      .get('/api/users');

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("Board Endpoints", () => {
  it("Should return an array of Boards", async () => {

    const res = await request(app)
      .get('/api/boards')

      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
  })
})

describe("List Endpoints", () => {

    it("Should create an initial list", async () => {
      const res = await request(app)
      .get('/api/lists')
  
      expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    })
 
})

describe("Card Endpoints", () => {

  it("Should create an initial card", async () => {
    const res = await request(app)
    .get('/api/cards')

    expect(res.status).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
  })

})

describe("Auth Endpoints", () => {

  it("Should return an error if user is not authorized", async () => {

    const res = await request(app)
      .get('/auth/profile')

    expect(res.status).toEqual(404)
  });
  
});

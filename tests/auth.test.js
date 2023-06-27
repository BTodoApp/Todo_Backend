const request = require('supertest');
const bcrypt = require('bcrypt-nodejs');
const app = require('../index');
const { User, Board, List } = require('../models/index');
const dotenv = require('dotenv');
dotenv.config();
const SALT_ROUNDS = process.env.SALT_ROUNDS
const salt = bcrypt.genSaltSync(Number(SALT_ROUNDS));

jest.setTimeout(30000);

describe('Auth Endpoints', () => {

  describe('POST /auth/register', () => {
    it('should create a new user with default board and lists', async () => {
        const password = 'testpassword';
        const res = await request(app)
          .post('/auth/register')
          .send({
            email: 'testuser2@example.com',
            password: password,
            name: 'testuser2',
          });
      
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("User created");

        
        const { id: id } = res.body.user;
        const user = await User.findByPk(id);
      
        expect(user).toBeTruthy();
      });

    it('should return 409 if email is already taken', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'testuser2@example.com',
          password: 'password123',
          name: 'Test User'
        });
      expect(res.statusCode).toEqual(409);
    });
  });

  describe('POST /auth/login', () => {
    let authToken;
  
    beforeAll(async () => {
      const registering = await request(app)
        .post('/auth/register')
        .send({
          email: 'testuser3@example.com',
          password: 'testpassword',
          name: 'testuser3',
        });
    });
  
    afterAll(async () => {
        await User.destroy({ where: { email: 'testuser3@example.com' } });
      });      
  
    it('should return an authentication token', async () => {
        const res = await request(app)
          .post('/auth/login')
          .send({
            email: 'testuser3@example.com',
            password: 'testpassword'
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.token).toBeDefined();
        authToken = res.body.token;
      });
  
    it('should return 401 when given an invalid email or password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'invalidpassword'
        });
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /auth/update/:userId', () => {
    let authToken;
  
    beforeAll(async () => {
      // Register a user and get an auth token
      const password = 'testpassword';
      const registering = await request(app)
        .post('/auth/register')
        .send({
          email: 'testuser4@example.com',
          password: password,
          name: 'testuser4',
        });
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'testuser4@example.com',
          password: password,
        });
      authToken = res.body.token;
    });
  
    afterAll(async () => {
      await User.destroy({ where: { email: 'testuser4@example.com' } });
    });
  
    it('should update password for a valid user', async () => {
      const currentPassword = 'testpassword';
      const newPassword = 'newtestpassword';
      const user = await User.findOne({ where: { email: 'testuser4@example.com' } });
      const userID = user ? user.id : null;
  
      const res = await request(app)
        .post(`/auth/update/${userID}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: currentPassword,
          newPassword: newPassword,
        });
  
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Password updated');
  
    });
  
    it('should return 404 when given an invalid user id', async () => {
      const currentPassword = 'testpassword';
      const newPassword = 'newtestpassword';
  
      const res = await request(app)
        .post('/auth/update/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: currentPassword,
          newPassword: newPassword,
        });
  
      expect(res.statusCode).toEqual(404);
    });
  
    it('should return 401 when given an invalid current password', async () => {
      const currentPassword = 'invalidpassword';
      const newPassword = 'newtestpassword';
  
      const res = await request(app)
        .post('/auth/update/2')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: currentPassword,
          newPassword: newPassword,
        });
      expect(res.statusCode).toEqual(401);
    });
  });
  
  
});

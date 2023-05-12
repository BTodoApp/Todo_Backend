const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../index');
const { User, Board, List } = require('../models/index');
const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const SALT_ROUNDS = process.env.SALT_ROUNDS
const salt = bcrypt.genSaltSync(Number(SALT_ROUNDS));

jest.setTimeout(30000);

describe('Auth Endpoints', () => {

  describe('POST /auth/register', () => {
    it('should create a new user with default board and lists', async () => {
        const password = 'testpassword';
        const hash = await bcrypt.hash(password, salt);
        const res = await request(app)
          .post('/auth/register')
          .send({
            email: 'testuser2@example.com',
            password: hash,
            name: 'testuser2',
          });
      
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("User created");

        
        const { id: id } = res.body.user;
        const user = await User.findByPk(id, {
            include: {
                model: Board,
                include: List,
            },
        });
      
        expect(user).toBeTruthy();
        expect(user.Boards).toHaveLength(1);
        expect(user.Boards[0].Lists).toHaveLength(3);
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
  
    beforeEach(async () => {
      const registering = await request(app)
        .post('/auth/register')
        .send({
          email: 'testuser3@example.com',
          password: 'testpassword',
          name: 'testuser3',
        });
    });
  
    afterEach(async () => {
        await User.destroy({ where: { email: 'testuser3@example.com' } });
      });      
  
    it('should return an authentication token', async () => {
        const res = await request(app)
          .post('/auth/login')
          .send({
            email: 'testuser3@example.com', // change the email to match the created user
            password: 'testpassword'
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.token).toBeDefined();
        authToken = res.body.token; // save the token for later use in other tests
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
  
    beforeEach(async () => {
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
  
    afterEach(async () => {
      await User.destroy({ where: { email: 'testuser4@example.com' } });
    });
  
    it('should update password for a valid user', async () => {
      const currentPassword = 'testpassword';
      const newPassword = 'newtestpassword';
  
      const res = await request(app)
        .post('/auth/update/2')
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
